import { Profile } from "./profile.model";


export class Usuario {

  public profile?: Profile;

  constructor(
    public username: string,
    public email: string,
    public terminos: boolean,
    public password?: string,
    public google?: boolean,
    public role?: 'SUPERADMIN' | 'ADMIN' | 'USER' | 'MEMBER',
    public uid?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) { }

}

// export class Role {
//   id: number;
//   name: string;
//   }
