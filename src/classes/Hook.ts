import chain from '../tools/chain';
import Once from './Once';

import type { GraphQLResolveInfo } from 'graphql';
import type { ClassDirectiveConfig, IntrospectionDirectiveVisitor, VisitableIntrospectionType, VisitableSchemaType } from '../types';

export default
class Hook {
    protected _directives: ClassDirectiveConfig[];
    protected _method: keyof IntrospectionDirectiveVisitor;
    protected _once = new Once();

    /**
     * Hook constructor
     *
     * @param directives directives to be executed for type/field
     * @param method directives method to be called on resolve
     */
    constructor(directives: ClassDirectiveConfig[], method: keyof IntrospectionDirectiveVisitor) {
        this._directives = directives;
        this._method = method;
    }

    /**
     * Resolve type/field/enum/directive of user schema
     *
     * @param subject
     * @param root
     * @param context
     * @param info
     */
    public resolve<S extends VisitableIntrospectionType, R extends VisitableSchemaType = any, C = any>(
        subject: S, root: R, context: C, info: GraphQLResolveInfo
    ): Promise<S | null> | S | null {
        const session = this._once.session(context);
        if (session.isRunning) {
            return session.join();
        }
        session.start();

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
            subject = chain(subject, (subject) => visit(subject, info));
        }

        return chain(subject, (subject) => {
            session.complete(subject);
            return subject;
        });
    }
}
