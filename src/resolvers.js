const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Employee = require('./models/Employee');

const resolvers = {
    Query: {
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) throw new Error('User not found');
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error('Invalid credentials');
            return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        },
        
        // ✅ UPDATED: Now returns id explicitly
        getAllEmployees: async () => {
            return await Employee.find().select('_id first_name last_name email');
        },

        searchEmployeeByEid: async (_, { eid }) => await Employee.findById(eid),
        
        searchEmployeeByDesignationOrDepartment: async (_, args) => {
            const { designation, department } = args;
            return await Employee.find({ $or: [{ designation }, { department }] });
        }
    },

    Mutation: {
        signup: async (_, { username, email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            return await user.save();
        },

        addEmployee: async (_, args) => {
            const employee = new Employee(args);
            return await employee.save();
        },

        updateEmployee: async (_, { eid, ...updates }) => {
            return await Employee.findByIdAndUpdate(eid, updates, { new: true });
        },

        deleteEmployee: async (_, { eid }) => {
            await Employee.findByIdAndDelete(eid);
            return "Employee deleted successfully";
        }
    }
};

module.exports = resolvers;
