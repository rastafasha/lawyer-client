export class Favorite{
    id!:number;
    cliente_id!:number;
    user_id!:number;
    profile: Profile = new Profile();
}

export class Profile {
  id!: number;
  user_id!: number;
  speciality_id!: number;
  nombre: string = "";
  username: string = "";
  surname: string = "";
  email: string = "";
  avatar: string = "";
  // status: string = "";
  rating: number = 0;
  speciality_title: string = "";

}