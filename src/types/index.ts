import { ROLE, ORDER_DIRECTION } from "../utils/enums";

export type ExerciseListQueryParams = {
    programID?: number;
} & ListQueryParams;

export type ListQueryParams = {
    search?: string;
    limit?: number;
    page?: number;
    orderBy?: string;
    orderDirection?: ORDER_DIRECTION;
};

export type UserRequestParams = {
    name: string;
    surname: string;
    nickName: string;
    role: ROLE;
    age: number;
    userRole: ROLE;
    userId: string;
};
