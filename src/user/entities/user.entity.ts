import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  ObjectId,
  UpdateDateColumn,
} from 'typeorm';
import * as argon2 from 'argon2';

export enum UserRole {
  admin = 'admin',
  user = 'user',
}

class Otp {
  @Column()
  value: string;

  @Column()
  expiration: Date;
}

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  profileImage: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column(() => Otp)
  otp: Otp;

  @Column({ default: false })
  emailVerification: boolean;

  @BeforeInsert()
  async setDefaultEmailVerification() {
    if (this.emailVerification === undefined) {
      this.emailVerification = false;
    }
    await this.hashPassword();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await argon2.hash(this.password);
    }
  }

  comparePassword(attemptedPassword: string): Promise<boolean> {
    return argon2.verify(this.password, attemptedPassword);
  }
}
