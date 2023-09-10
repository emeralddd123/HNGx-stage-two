const Joi = require('joi')

const { UserModel } = require('./user.models')


const userSchema = Joi.object({
    name: Joi.string().min(3).max(255).required()
})

const addUser = async (req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        if (!value || !value.name) {
            return res.status(400).json({ error: "Name is required" });
        }
        const { name } = value; 

        const existingUser = await UserModel.findOne({ name });

        if (existingUser) {
            return res.status(409).json("Name has already been taken");
        }
        const newUser = new UserModel({
            name: name,
        });
        await newUser.save();
        return res.json(`User successfully added with name: ${name}`);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const getUser = async (req, res) => {
    const { name } = req.params;
    try {
        const existingUser = await UserModel.findOne({ name });

        if (existingUser) {
            return res.json(existingUser);
        } else {
            return res.status(404).json(`User with name ${name} does not exist.`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json('An error occurred.');
    }
};


const updateUser = async (req, res) => {
    const { name } = req.params;
    const { error, value } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const newName = value.name;
    try {
        const existingUser = await UserModel.findOne({ name });

        if (existingUser) {
            existingUser.name = newName; 
            await existingUser.save();

            return res.json(`User with name ${name} updated to ${newName}`);
        } else {
            return res.status(404).json(`User with name ${name} does not exist.`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json('An error occurred.');
    }
};


const deleteUser = async (req, res) => {
    const { name } = req.params;

    try {
        const deletedUser = await UserModel.deleteOne({ name });
        if (deletedUser.deletedCount === 1) {
            return res.status(200).json(`User with name ${name} has been deleted successfully`);
        } else {
            return res.status(404).json(`User with name ${name} not found.`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json('An error occurred.');
    }
};


module.exports = {
    addUser,
    getUser,
    updateUser,
    deleteUser
}