

const createSchema = <T extends SchemaBuilder<any>>(c: (t: SchemaBuilder, p: () => T) => T): T => {

    const a = c(new SchemaBuilder({}), () => a);

    return a;
}

/**
 * const UserSchema = createSchema(s => s
 *      .addStringField('name')
 *      .addIdField('id')
 *      .addSchemaField('user', UserSchema)
 * )
 */

type A<S extends Record<string, string>> = { [K in keyof S]: S[K] };

class SchemaBuilder<S extends Record<string, any> = {}> {
    constructor(protected schema: S) {}

    addStringField<N extends string>(name: N) {
        return new SchemaBuilder<S & { [name in N]: string }>({ ...this.schema, [name]: String });
    }

    addSchemaField<N extends string, SB extends SchemaBuilder<any>>(name: N, schema: () => SB) {
        return new SchemaBuilder<S & { [name in N]: SB }>({ ...this.schema, [name]: schema });
    }
}

const d = createSchema((s, p) => s
    .addStringField('asd')
    .addStringField('dfa')
)

const s = new SchemaBuilder({})
    .addStringField('asd')
    .addStringField('dfa');