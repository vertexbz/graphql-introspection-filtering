import chain from '../tools/chain';
import type { GraphQLResolveInfo } from 'graphql';
import type { VisitableSchemaType } from 'graphql-tools/dist/schemaVisitor';
import type { ClassDirectiveConfig, IntrospectionDirectiveVisitor, VisitableIntrospectionType } from '../types';

export default
class Hook {
    protected _directives: ClassDirectiveConfig[];
    protected _method: keyof IntrospectionDirectiveVisitor;

    constructor(directives: ClassDirectiveConfig[], method: keyof IntrospectionDirectiveVisitor) {
        this._directives = directives;
        this._method = method;
    }

    public resolve<T extends VisitableIntrospectionType, R extends VisitableSchemaType = any, C = any>(
        result: T, root: R, context: C, info: GraphQLResolveInfo
    ): Promise<T | null> | T | null {
        for (const config of this._directives) {
            const Directive = config.cls;

            const directive = new Directive({
                name: config.name,
                args: config.args,
                visitedType: root as VisitableSchemaType,
                schema: info.schema,
                context
            });

            // @ts-ignore
            const visit = directive[this._method].bind(directive);

            // @ts-ignore
            result = chain(result, (result) => visit(result, info));
        }

        return result;
    }
}
