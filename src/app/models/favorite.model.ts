export class Favorite{
    id!:number;
    cliente_id!:number;
    user_id!:number;
    profile: Profile = new Profile();
}

export class Profile {
  id!: number;
  user_id!: string;
  speciality!: string;
  nombre: string = "";
  username: string = "";
  surname: string = "";
  email: string = "";
  avatar: string = "";
  // status: string = "";
  rating: number = 0;
  speciality_title: string = "";

}