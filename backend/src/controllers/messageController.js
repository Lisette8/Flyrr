import User from "../entities/User.js";
import Message from "../entities/Message.js"
import cloudi from "../lib/cloudinary.js";

const getContacts = async (req, res) => {
    //so basically to get all of the contacts we gotta return all of the users (user = contact)
    try{
        const loggedInUserId = req.user._id;
        const fetchedContacts = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(fetchedContacts);
    }
    catch(error){
        console.error(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const getPartners = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;

        // find all the messages where the logged-in user is either sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        });
        
        //i'll return the id of the user that i'm talking to, it's a list [] because i might be talking to one or many users , so it's a list of user ids
        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString()
                        ? msg.receiverId.toString()
                        : msg.senderId.toString()
                )
            ),
        ];

        //the users ids in the list chatPartnerIds are gonna be fetched to return the actual user infos
        //to fetch we use find... so User.find , we're fetching all users that _id is inside of the list (in operator)
        const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");


        
        res.status(200).json(chatPartners);

    }
    catch(error){
        console.error(error)
        res.status(500).json({message: "Internal Server Error"})
    }

}

const getMessageByUserId = async (req,res) => {

    try{
        const {id: HIM} = req.params;
        const ME = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: ME, receiverId: HIM},
                {senderId: HIM, receiverId: ME},
            ],
        })

        res.status(200).json(messages);
    }
    catch(error){
        console.error(error)
        res.status(500).json({message: "Internal Server Error"})
    }

}

const sendMessage = async (res,res) => {    
    try {
        const {image, text} = req.body
        const senderId = req.user._id
        const {id: receiverId} = req.params

        let imgLink;

        //the user can send 2 types of messages, either a text or an image for our case
        //if the message is an image, it must be uploaded to cloudinary as a base64 image...
        if(image){
            const uploadedResponse = await cloudi.uploader.upload(image)
            imgLink = uploadedResponse.secure_url;
        }

        //create a new instance of the message then store it inside the database
        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imgLink
        })

        const savedMessage = await newMessage.save();

        res.status(200).json(savedMessage)
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}



export {getContacts, getPartners, getMessageByUserId, sendMessage}