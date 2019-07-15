
![alt text](https://repository-images.githubusercontent.com/166414581/dc0a1b80-a1a0-11e9-805b-cf8be46b5507)
# Migration 0.0.1 -> 0.0.2

- Please update your packages using yarn or npm

## Controllers 
- Controllers now return the value to send.
- They have a new **BeforeMethod()** member , which is a function that is executed before each method.
- A repository member is setup in each controller and instantiated in the BeforeMethod()

Before
```
    public async create(req: Request, res: Response, next: Function) {
        const repository = getRepository(User);
        const user = new User(req.body);
        const savedUser = await repository.save(user);

        res.status(HttpStatus.CREATED);
        res.json(new UserSerializer().serialize(savedUser));
    }
```

Now : 
```
    protected repository: BaseRepository<User>;

    // ...

    protected beforeMethod(): void {
        this.repository = getCustomRepository(UserRepository);
    }
      
    // ...
    
    public async create(req: Request, res: Response, next: Function) {
        const user = new User(req.body);
        const savedUser = await this.repository.save(user); // no need to getRepository each time

        res.status(HttpStatus.CREATED);
        return new UserSerializer().serialize(savedUser);
    }
```

## Models

- Model now inherit from **BaseModel** class , but old models will still work

## Routes 

- **deserialize** method now have a *nullEqualsUndefined* argument that can be null , just call the deserialize option without arguments
- json-api relationships conversion is now handled in route and not in the serializer , you need to specify an array with the model name and the name of the deserialized relation
- validation method is now a middleware function , **handleValidation**
- to call a method from the controller , you now need to use the **method** function from the controller 

Old route
```
.patch(authorize([ADMIN]), userMiddleware.deserialize ,validate(updateUser), SecurityMiddleware.sanitize, userController.update)
```

New route
```
.patch(authorize([ADMIN]), userMiddleware.deserialize(true), userMiddleware.deserializeRelationships([{
        relation: 'avatar',
        model: 'document'
}]), userMiddleware.handleValidation(updateUser), SecurityMiddleware.sanitize, userController.method('update'))
```

## Serializers

- Pagination is now setup by the base class with the method **setupPagination**
- *withelist* member has been changed to *whitelist* , it was a typo error
- Please refer to [json-api-serializer](https://github.com/danivek/json-api-serializer) documentation

example file : 
```
constructor(serializerParams: SerializerParams = new SerializerParams()) {
    super('user');

    const data = {
        whitelist: UserSerializer.whitelist,
        relationships: {
            avatar: {
                type: "document"
            },
            documents: {
                type: "document"
            }
        },
    };

    this.setupPagination(data, serializerParams);

    this.serializer.register(this.type, data);

    this.serializer.register("document", {
        whitelist: DocumentSerializer.whitelist
    });
}
```

## Validation

- Validation now use express-validator library instead of express-validation , for the Schema validation please refer to [this page](https://express-validator.github.io/docs/schema-validation.html)
- All exported members have a Schema type required for express-validator


- You can still use [@hapi/joi](https://github.com/hapijs/joi) for object validation using the custom property from express-validator : 
```
email: {
    custom: {
        options: (email: any, {req, path}) => {
            const res = Joi.string().email().validate(email); // old validation format
            if (res.error !== null) throw Error(res.error);
            return true;
        }
    }
}
```


Example : 
```
// PATCH /v1/users/:userId
const updateUser: Schema = {
    userId: {
        in: ['params'],
        errorMessage: 'Please provide a valid id',
        isInt: true
    },
    email: {
        optional: {
            nullable: true
        },
        isEmail: true
    },
    password: {
        optional: {
            nullable: true
        }
    },
    username: {
        optional: {
            nullable: true
        },
    },
    lastname: {
        optional: {
            nullable: true
        },
        isUppercase: {
            negated: true,
        }
    },
    firstname: {
        optional: {
            nullable: true
        }
    },
    role: {
        optional: true,
        isIn: {
            options: [roles]
        }
    }
};
```

## Authentication

- Login/Register/Refresh-token response is now in json-api format
- This part is subject to change

Response type : 
```
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": {
    "type": "refresh_token",
    "attributes": {
      "expires": "2019-08-14T08:34:29.639Z",
      "access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjMxODA1NjksImlhdCI6MTU2MzE3OTY2OSwic3ViIjo5OX0.kMoWC1ttrfOsoB4ozUzM465hRrbbbdub70XQX8MhPIE",
      "refresh-token": "99.f11fd7edd80705cb292ba3c220b663c4f1456b033ad51a296b16f88edaad240178cfdfc6510545f8"
    },
    "relationships": {
      "user": {
        "data": {
          "type": "user",
          "id": "99"
        }
      }
    }
  },
  "included": [
    {
      "type": "user",
      "id": "99",
      "attributes": {
        "username": "amaury",
        "email": "amaury@localhost.com",
        "services": {},
        "firstname": "amaury",
        "lastname": "amaury",
        "role": "admin",
        "created-at": "2019-07-15T06:34:01.728Z",
        "updated-at": "2019-07-15T06:34:01.728Z"
      }
    }
  ]
}
```


##Configuration files

- .env files now need 5 new fields for oAuth and caching :

```
REQUEST_CACHING = 1

FACEBOOK_APP_ID='-1'

FACEBOOK_APP_SECRET='-1'

GOOGLE_CONSUMER_KEY='-1'

GOOGLE_CONSUMER_SECRET='-1'
```