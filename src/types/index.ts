import { ROLE } from "../utils/enums";

export type UserRequestParams = {
    name: string;
    surname: string;
    nickName: string;
    role: ROLE;
    age: number;
    userRole: ROLE;
    userId: string;
};
