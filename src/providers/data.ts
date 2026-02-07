import { CreateDataProviderOptions, createDataProvider } from "@refinedev/rest";
import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { HttpError } from "@refinedev/core";

if (!BACKEND_BASE_URL) {
  throw new Error("BACKEND_BASE_URL is not defined");
};

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message ='Request failed.';

  try {
    const payload = (await response.json() as { message?: string });

    if (payload?.message) message = payload.message;
  } catch (e) {
    console.error("Failed to parse error response:", e);
    // Ignore errors
  };

  return {
    message,
    statusCode: response.status,
  };
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters}) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = { page, limit: pageSize };

      filters?.forEach((filter) => {
        const field = 'field' in filter ? filter.field : '';

        const value = String(filter.value)
        if (resource === "subjects") {
          if (field === "department") params.department = value;
          if (field === "name" || field === "code") params.search = value;
        }
      });

      return params;
    },

    mapResponse: async (response) => {
      if(!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      return payload.data ?? [];
    },

    getTotalCount: async(response) => {
      if(!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    }
  }
}

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };

// import { MOCK_SUBJECTS } from "@/constants";
// import {
//   BaseRecord,
//   DataProvider,
//   GetListParams,
//   GetListResponse,
// } from "@refinedev/core";

// export const dataProvider: DataProvider = {
//   getList: async <TData extends BaseRecord = BaseRecord>({
//     resource,
//   }: GetListParams): Promise<GetListResponse<TData>> => {
//     // Implementation for fetching a list of resources
//     if (resource !== "subjects") {
//       return { data: [] as TData[], total: 0 };
//     }

//     return {
//       data: MOCK_SUBJECTS as unknown as TData[],
//       total: MOCK_SUBJECTS.length,
//     };
//   },

//   getOne: async () => {
//     throw new Error("This function is not present in mock");
//   },

//   create: async () => {
//     throw new Error("This function is not present in mock");
//   },

//   update: async () => {
//     throw new Error("This function is not present in mock");
//   },

//   deleteOne: async () => {
//     throw new Error("This function is not present in mock");
//   },

//   getApiUrl: () => "",
// };
