import { verify } from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../constants/http_status";

export default (req: any, res: any, next: any) => {
  const token = req.headers.access_token as string;
  console.log(token);
  if (!token) {
    return res.status(HTTP_UNAUTHORIZED).send();
  }

  try {
    const decodeUser = verify(token, process.env.JWT_SECRET!);
    req.user = decodeUser;
  } catch (error) {
    res.status(HTTP_UNAUTHORIZED).send();
  }

  return next();
};
