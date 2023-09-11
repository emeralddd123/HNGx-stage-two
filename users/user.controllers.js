const Joi = require('joi')

const { UserModel } = require('./user.models')


const userSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    age: Joi.number().integer().required(),
    country: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    age: Joi.number().integer(),
    country: Joi.string()
});


const addUser = async (req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        if (!value || !value.name || !value.age || !value.country) {
            return res.status(400).json({ error: "Name, age, and country are required" });
        }

        const { name, age, country } = value;

        if (!Number.isInteger(age) || age <= 0) {
            return res.status(400).json({ error: "Age must be a positive integer" });
        }

        if (typeof country !== 'string' || country.length === 0) {
            return res.status(400).json({ error: "Country must be a non-empty string" });
        }

        const existingUser = await UserModel.findOne({ name });

        if (existingUser) {
            return res.status(409).json("Name has already been taken");
        }

        const newUser = new UserModel({
            name,
            age,
            country,
        });
        await newUser.save();
        return res.json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const existingUser = await UserModel.findById(id);

        if (existingUser) {
            return res.json(existingUser);
        } else {
            return res.status(404).json(`User with id ${id} does not exist.`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json('An error occurred.');
    }
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    const { error, value } = userUpdateSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const newName = value.name;
    const newAge = value.age;
    const newCountry = value.country;

    try {
        const existingUser = await UserModel.findById(id);

        if (existingUser) {
            existingUser.name = newName || existingUser.name;
            existingUser.age = newAge || existingUser.age;
            existingUser.country= newCountry || existingUser.country;
            await existingUser.save();

            return res.json({existingUser});
        } else {
            return res.status(404).json(`User with id ${id} does not exist.`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json('An error occurred.');
    }
};


const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (deletedUser) {
            return res.status(200).json(`User  has been deleted successfully`);
        } else {
            return res.status(404).json(`User with id ${id} not found.`);
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