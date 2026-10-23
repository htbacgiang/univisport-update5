import db from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  await db.connectDb();
  const { method, query: { userId, addressId } } = req;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    switch (method) {
      case "GET": {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (addressId) {
          const address = user.address.find(
            (addr) => addr._id.toString() === addressId
          );
          if (!address)
            return res.status(404).json({ error: "Address not found" });
          return res.status(200).json({ address });
        } else {
          return res.status(200).json({ addresses: user.address });
        }
      }
      case "POST": {
        const newAddress = req.body;
        if (newAddress.isDefault) {
          await User.updateOne(
            { _id: userId },
            { $set: { "address.$[].isDefault": false } }
          );
        }
        const user = await User.findByIdAndUpdate(
          userId,
          { $push: { address: newAddress } },
          { new: true }
        );
        return res.status(200).json({ addresses: user.address });
      }
      case "PUT": {
        const updatedAddress = req.body;
        // Sử dụng addressId từ payload hoặc _id nếu không có
        const addrId = updatedAddress.addressId || updatedAddress._id;
        if (!addrId) {
          return res.status(400).json({ error: "Missing addressId" });
        }
        if (updatedAddress.isDefault) {
          await User.updateOne(
            { _id: userId },
            { $set: { "address.$[].isDefault": false } }
          );
        }
        const user = await User.findOneAndUpdate(
          { _id: userId, "address._id": addrId },
          { $set: { "address.$": updatedAddress } },
          { new: true }
        );
        return res.status(200).json({ addresses: user.address });
      }
      case "DELETE": {
        const id = addressId || req.body.addressId;
        if (!id) {
          return res.status(400).json({ error: "Missing addressId" });
        }
        const user = await User.findByIdAndUpdate(
          userId,
          { $pull: { address: { _id: id } } },
          { new: true }
        );
        return res.status(200).json({ addresses: user.address });
      }
      default: {
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    console.error("Address API error:", error);
    return res.status(400).json({ error: error.message });
  }
}
