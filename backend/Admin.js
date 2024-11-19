import userModel from "./models/userModel";
import bcrypt from "bcrypt";

async function createAdminUser() {
  try {
    const existingAdmin = await userModel.findOne({
      email: "admin@example.com",
    });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10); // Replace 'yourAdminPassword' with a strong password

    const adminUser = new userModel({
      name: "Admin Name",
      email: "admin@example.com",
      password: hashedPassword,
      phone: "1234567890", // Example phone number
      address: "123 Admin St.", // Example address
      role: 1, // Assuming '1' is the role for admin
    });

    await adminUser.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

createAdminUser(); // Call the function to create the admin user
