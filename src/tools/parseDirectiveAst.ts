import type { DirectiveNode } from 'graphql/language/ast';
import type { DirectiveConfig } from '../types';

/**
 * Grabs directive name and arguments from AST
 *
 * @param directives array of AST definitions for directives applied to type/field
 */
export default (directives: ReadonlyArray<DirectiveNode>): DirectiveConfig[] => {
    return directives
        .map(({ name: { value: name }, arguments: args = [] }) => {
            return {
                name,
                args: args.reduce((args: Record<string, any>, { name: { value: name }, value }) => {
                    args[name] = (value as any).value || null;
                    return args;
                }, {})
            };
        });
};
