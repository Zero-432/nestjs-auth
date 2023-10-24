import { ArticleService } from 'src/articles/services/article.service';
import { TPolicyHandler } from '../interfaces/policy-handler.interface';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { Article } from 'src/schemas/article.schema';
import { Action } from '../enums/action.enum';

export class DeleteArticlePolicyHandler implements TPolicyHandler {
  private articleService: ArticleService;
  handle(ability: AppAbility, article: Article) {
    return ability.can(Action.Delete, article);
  }
}
