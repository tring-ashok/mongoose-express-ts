import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "./User";

/**
 * Interface to model the User Schema for TypeScript.
 * @param companyName:string
 * @param licenseType:string
 * @param adminName:string
 * @param adminEmail:string
 * @param adminContactNo:string
 * @param createdBy:ref => User._id;
 */
export interface IAccount extends Document {
  companyName: string;
  adminName: string;
  adminEmail: string;
  adminContactNo: number;
  features: Array<string>;
  createdBy: IUser["_id"];
}

const accountSchema: Schema = new Schema({
  companyName: {
    type: String,
    required: true,
    unique: true
  },
  adminName: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
  },
  adminContactNo: {
    type: Number,
    required: true,
  },
  features: [{
    type: String,
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Account: Model<IAccount> = model("Account", accountSchema);

export default Account;
