import { ApiCode } from "@/enum/enum";

export interface ResponseResult<T> {
  code: number;
  msg: string;
  data?: T;
}

const ok = <T = undefined>(msg: string, data?: T): ResponseResult<T> => {
  return {
    code: ApiCode.SUCCESS,
    msg,
    data,
  };
};

const error = <T = undefined>(msg: string, data?: T): ResponseResult<T> => {
  return {
    code: ApiCode.ERROR,
    msg,
    data,
  };
};
export const R = {
  ok,
  error,
};
