import R from "./ApiResponse";

class Request {
  async get<T = any>(
    url: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    // 序列化查询参数（过滤null/undefined，处理特殊字符）
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    // 拼接参数到URL
    const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

    try {
      // 发起GET请求（保留原生fetch配置）
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          // 可添加通用请求头（如Token），轻量封装不做过度配置
        },
        credentials: "same-origin",
      });
      if (!response.ok) {
        throw new Error(
          `HTTP请求失败：${response.status} ${response.statusText}`,
          {
            cause: { status: response.status, url: fullUrl }, // 携带错误上下文
          },
        );
      }
      let res: R<T>;
      try {
        res = await response.json();
      } catch (e) {
        throw new Error("接口响应解析失败，非合法JSON格式", {
          cause: { url: fullUrl, originalError: e },
        });
      }

      // 3. 业务层错误处理（根据后端统一响应体判断，如code≠200）
      // 假设ApiResponse包含：code(业务码)、msg(提示信息)、data(业务数据)
      if (res.code !== 0) {
        // 适配常见业务成功码，可根据实际调整
        throw new Error(`业务请求失败：${res.msg || "未知错误"}`, {
          cause: { code: res.code, url: fullUrl, data: res },
        });
      }

      // 成功返回业务层数据，屏蔽响应体其他字段
      return res.data as T;
    } catch (e) {
      // 统一错误透传，保留错误上下文，方便上层捕获处理
      if (e instanceof Error) throw e;
      throw new Error("未知请求错误", {
        cause: { url: fullUrl, originalError: e },
      });
    }
  }

  /**
   * POST 请求封装
   * @param url 接口地址
   * @param body 请求体参数
   * @returns 业务层数据（自动类型推导）
   */
  async post<T = any>(url: string, body: Record<string, any> = {}): Promise<T> {
    try {
      // 发起POST请求
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        credentials: "same-origin",
        body: JSON.stringify(body), // 序列化请求体
      });

      // 1. HTTP状态码错误处理
      if (!response.ok) {
        throw new Error(
          `HTTP请求失败：${response.status} ${response.statusText}`,
          {
            cause: { status: response.status, url, body },
          },
        );
      }

      // 2. 响应体解析错误处理
      let res: R<T>;
      try {
        res = await response.json();
      } catch (e) {
        throw new Error("接口响应解析失败，非合法JSON格式", {
          cause: { url, originalError: e },
        });
      }

      // 3. 业务层错误处理
      if (res.code !== 200 && res.code !== 0) {
        throw new Error(`${res.msg || "未知错误"}`, {
          cause: { code: res.code, url, data: res },
        });
      }

      // 成功返回业务数据
      return res.data as T;
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new Error("未知请求错误", { cause: { url, originalError: e } });
    }
  }
}

export const request = new Request();
