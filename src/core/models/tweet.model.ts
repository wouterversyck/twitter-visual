export type Tweet = {
  id: string;
  created_at: string;
  text: string;
  user: User;
};

export type User = {
  id: string;
  name: string;
  profile_image_url: string;
  profile_image_url_https: string;
  screen_name: string;
};
