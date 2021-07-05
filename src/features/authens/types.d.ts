declare module 'MyModels' {
  export type SocialProfile = {
    id?: number,
    full_name?: string,
    email?: string,
    type: SocialType,
    user_photos?: string,
    user?: string,
    profile?: object
  };

  export type ErrorMessage = {
    message?: string,
    code?: number
  };
  export type SocialType = 'fb' | 'google' | 'apple'
}
