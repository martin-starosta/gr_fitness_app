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

export type TCompletedExercise = {
    userId: number;
    exerciseID: number;
    duration: number;
};

export type TExercise = {
    id?: number;
    name: string;
    difficulty: string;
    programID: number;
};

export type TUser = {
    id?: number;
    email: string;
    password: string;
    name: string;
    surname: string;
    nickName: string;
    role: ROLE;
    age: number;
};
