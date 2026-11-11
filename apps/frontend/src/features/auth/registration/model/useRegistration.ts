import { useRegisterMutation } from "@/entities/auth/api";


import type { RegisterFormInput } from "@booking-platform/shared";


export const useRegistration = () => {
  const [registrationMutation, { isLoading }] = useRegisterMutation();
  // const dispatch = useAppDispatch();


  async function registration(credential: RegisterFormInput) {
    const data = await registrationMutation(credential).unwrap();

    return data;

    // const data = await registrationMutation(credential).unwrap();
    // dispatch(setCredentials(data));
  }

  return { registration, isLoading };
};
