import { Schema, Number, String, Nested, Field } from 'fastest-validator-decorators';

@Schema({
  strict: true
})
class ValidatedJsonApiQueryPagination {
  @Number({
    min: 1
  })
  declare number: number;

  @Number({
    min: 1,
    max: 20
  })
  declare size: number;
}

@Schema({
  strict: true
})
export class ValidatedJsonApiQuery {
  @String({
    optional: true
  })
  public include?: string[];

  @String({
    optional: true
  })
  public sort?: string[];

  @Nested({
    optional: true
  })
  public page?: ValidatedJsonApiQueryPagination;

  @Field({
    type: 'multi',
    optional: true,
    rules: [{ type: 'object' }, { type: 'string' }, { type: 'array' }]
  })
  public fields?: string[];

  @Nested({
    optional: true
  })
  public filter?: Record<string, unknown>;
}
