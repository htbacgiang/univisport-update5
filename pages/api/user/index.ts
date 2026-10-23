import { NextApiHandler } from "next";
import User from "../../../models/User";
import { LatestUserProfile } from "../../../utils/types";
import { requireAdmin } from "../../../lib/adminAuth";

const handler: NextApiHandler = async (req, res) => {
  if (!(await requireAdmin(req, res))) return;

  const { method } = req;
  switch (method) {
    case "GET":
      return getLatestUsers(req, res);
    default:
      res.status(404).send("Not found!");
  }
};

const getLatestUsers: NextApiHandler = async (req, res) => {
  const { pageNo = "0", limit = "5" } = req.query as {
    pageNo: string;
    limit: string;
  };

  const results = await User.find({ role: "user" })
    .sort({ createdAt: "desc" })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .select("name email avatar provider");

  const users: LatestUserProfile[] = results.map(
    ({ _id, name, email, avatar, provider }) => ({
      id: _id.toString(),
      name,
      avatar,
      provider,
      email,
    })
  );

  res.json({ users });
};

export default handler;
