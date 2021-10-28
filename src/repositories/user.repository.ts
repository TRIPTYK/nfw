import { Repository } from "@mikro-orm/core";

@Repository(Author)
export class CustomAuthorRepository extends EntityRepository<Author> {

  // your custom methods...
  public findAndUpdate(...) {
    // ...
  }

}