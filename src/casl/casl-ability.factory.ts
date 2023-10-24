import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
  buildMongoQueryMatcher,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { $nor, nor } from '@ucast/mongo2js';
import { Action } from 'src/common/enums/action.enum';
import { Role } from 'src/common/enums/role.enum';
import { Article } from 'src/schemas/article.schema';
import { User } from 'src/schemas/user.schema';

type Subjects = InferSubjects<typeof User | typeof Article> | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

const conditionsMatcher = buildMongoQueryMatcher({ $nor }, { nor });

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );

    if (user.roles.includes(Role.Admin)) {
      can(Action.Manage, 'all');
    }

    if (user.roles.includes(Role.User)) {
      can(Action.Create, Article);
      can(Action.Update, Article, { author: user._id });
      can(Action.Delete, Article, { author: user._id });
      can(Action.Read, Article), { author: user._id };

      can(Action.Read, User, {
        email: user.email,
      });
      cannot(Action.Create, User).because('only admins!!!');
      can(Action.Update, User, { email: user.email });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher,
    });
  }
}
