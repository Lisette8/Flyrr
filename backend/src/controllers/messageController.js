import Notification from "../entities/Notification.js";
import User from "../entities/User.js";
import Message from "../entities/Message.js"
import cloudi from "../lib/cloudinary.js";
import { getIO, getReceiverSocketId } from "../socket/socketHandlers.js";

const getContacts = async (req, res) => {
    //so basically to get all of the contacts we gotta return all of the users (user = contact)
    try {
        const loggedInUserId = req.user._id;
        const fetchedContacts = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(fetchedContacts);
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const getPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // find all the messages where the logged-in user is either sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        });

        // Get unique partner IDs
        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString()
                        ? msg.receiverId.toString()
                        : msg.senderId.toString()
                )
            ),
        ];

        // Fetch partner details and their last message
        const partnersData = await Promise.all(chatPartnerIds.map(async (partnerId) => {
            const user = await User.findById(partnerId).select("-password");

            // Find last message between loggedInUser and this partner
            const lastMessage = await Message.findOne({
                $or: [
                    { senderId: loggedInUserId, receiverId: partnerId },
                    { senderId: partnerId, receiverId: loggedInUserId }
                ]
            }).sort({ createdAt: -1 }); // Get the most recent message

            return {
                user,
                lastMessage
            };
        }));

        // Filter out invalid users and sort by latest message
        const sortedPartners = partnersData
            .filter(p => p.user)
            .sort((a, b) => {
                const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
                const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
                return dateB - dateA;
            });

        res.status(200).json(sortedPartners);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getMessageByUserId = async (req, res) => {

    try {
        const { id: HIM } = req.params;
        const ME = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: ME, receiverId: HIM },
                { senderId: HIM, receiverId: ME },
            ],
        })

        res.status(200).json(messages);
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }

}

const sendMessage = async (req, res) => {
    try {
        const { image, text } = req.body
        const senderId = req.user._id
        const { id: receiverId } = req.params

        // Validate that message has content
        if (!text && !image) {
            return res.status(400).json({ message: "Message must have text or image" });
        }

        let imgLink = "";

        //the user can send 2 types of messages, either a text or an image for our case
        //if the message is an image, it must be uploaded to cloudinary as a base64 image...
        if (image) {
            try {
                const uploadedResponse = await cloudi.uploader.upload(image, {
                    folder: "flyrr_messages",
                    resource_type: "auto",
                });
                imgLink = uploadedResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(400).json({ message: "Failed to upload image" });
            }
        }

        //create a new instance of the message then store it inside the database
        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text || "",
            image: imgLink || ""
        })

        const savedMessage = await newMessage.save();

        // Populate sender and receiver info
        await savedMessage.populate("senderId", "username profilePic");
        await savedMessage.populate("receiverId", "username profilePic");

        // Send via Socket.IO to receiver if online
        const io = getIO();
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", savedMessage);

            // Emit notification event
            const newNotification = new Notification({
                recipient: receiverId,
                sender: senderId,
                type: "new_message",
            });
            await newNotification.save();
            await newNotification.populate("sender", "username profilePic");

            io.to(receiverSocketId).emit("newNotification", newNotification);
        } else {
            // Create notification even if offline
            const newNotification = new Notification({
                recipient: receiverId,
                sender: senderId,
                type: "new_message",
            });
            await newNotification.save();
        }

        res.status(201).json(savedMessage)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}



export { getContacts, getPartners, getMessageByUserId, sendMessage }