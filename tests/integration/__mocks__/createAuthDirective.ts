import { SchemaDirectiveVisitor } from "graphql-tools";
import {
    GraphQLArgument,
    GraphQLEnumType,
    GraphQLEnumValue,
    GraphQLField,
    GraphQLInputField,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLResolveInfo,
    GraphQLUnionType
} from "graphql";

export default (roles: string[]) =>
class AuthDirective extends SchemaDirectiveVisitor {
    public static visitTypeIntrospection<TSource, TContext, TArgs = { [key: string]: any }>(
        field: GraphQLField<TSource, TContext, TArgs> | GraphQLObjectType,
        root: TSource,
        args: TArgs,
        context: TContext,
        info: GraphQLResolveInfo
    ): Promise<boolean> {
        return this.isAccessible(field, context);
    }

    public static visitFieldIntrospection<TSource, TContext, TArgs = { [key: string]: any }>(
        field: GraphQLField<TSource, TContext, TArgs> | GraphQLObjectType,
        root: TSource,
        args: TArgs,
        context: TContext,
        info: GraphQLResolveInfo
    ): Promise<boolean> {
        return this.isAccessible(field, context);
    }

    public static async visitDirectiveIntrospection<TSource, TContext, TArgs = { [key: string]: any }>(
        field: GraphQLField<TSource, TContext, TArgs> | GraphQLObjectType,
        root: TSource,
        args: TArgs,
        context: TContext,
        info: GraphQLResolveInfo
    ): Promise<boolean> {
        await new Promise((res) => setTimeout(res, 10));
        if (field.name !== 'auth') {
            return true;
        }
        return roles.includes('ADMIN');
    }

    public static visitArgsIntrospection<TSource, TContext, TArgs = { [key: string]: any }>(
        field: GraphQLField<TSource, TContext, TArgs> | GraphQLObjectType,
        root: TSource,
        args: TArgs,
        context: TContext,
        info: GraphQLResolveInfo
    ): Promise<boolean> {
        return this.isAccessible(field, context);
    }

    public static visitEnumValuesIntrospection<TSource, TContext, TArgs = { [key: string]: any }>(
        field: GraphQLField<TSource, TContext, TArgs> | GraphQLObjectType,
        root: TSource,
        args: TArgs,
        context: TContext,
        info: GraphQLResolveInfo
    ): Promise<boolean> {
        return this.isAccessible(field, context);
    }

    public static visitInputFieldsIntrospection<TSource, TContext, TArgs = { [key: string]: any }>(
        field: GraphQLField<TSource, TContext, TArgs> | GraphQLObjectType,
        root: TSource,
        args: TArgs,
        context: TContext,
        info: GraphQLResolveInfo
    ): Promise<boolean> {
        return this.isAccessible(field, context);
    }

    public static visitPossibleTypesIntrospection<TSource, TContext, TArgs = { [key: string]: any }>(
        field: GraphQLField<TSource, TContext, TArgs> | GraphQLObjectType,
        root: TSource,
        args: TArgs,
        context: TContext,
        info: GraphQLResolveInfo
    ): Promise<boolean> {
        return this.isAccessible(field, context);
    }

    public static async isAccessible(field: any, context: any) {
        await new Promise((res) => setTimeout(res, 10));
        for (const directive of field.astNode?.directives || []) {
            const name = directive.name.value;
            if (name === 'auth') {
                const arg = directive.arguments[0]?.value.value || 'ADMIN';
                return roles.includes(arg);
            }
        }

        return true;
    }

    // required by SchemaDirectiveVisitor
    visitObject(object: GraphQLObjectType): GraphQLObjectType | void | null {
        return super.visitObject(object);
    }

    visitInputFieldDefinition(field: GraphQLInputField, details: { objectType: GraphQLInputObjectType }): GraphQLInputField | void | null {
        return super.visitInputFieldDefinition(field, details);
    }

    visitFieldDefinition(
        field: GraphQLField<any, any>,
        details: { objectType: GraphQLObjectType | GraphQLInterfaceType }
    ): GraphQLField<any, any> | void | null {
        return super.visitFieldDefinition(field, details);
    }

    visitEnum(type: GraphQLEnumType): GraphQLEnumType | void | null {
        return super.visitEnum(type);
    }

    visitInterface(iface: GraphQLInterfaceType): GraphQLInterfaceType | void | null {
        return super.visitInterface(iface);
    }

    visitUnion(union: GraphQLUnionType): GraphQLUnionType | void | null {
        return super.visitUnion(union);
    }

    visitEnumValue(value: GraphQLEnumValue, details: { enumType: GraphQLEnumType }): GraphQLEnumValue | void | null {
        return super.visitEnumValue(value, details);
    }

    visitArgumentDefinition(
        argument: GraphQLArgument,
        details: { field: GraphQLField<any, any>; objectType: GraphQLObjectType | GraphQLInterfaceType }
    ): GraphQLArgument | void | null {
        return super.visitArgumentDefinition(argument, details);
    }

    visitInputObject(object: GraphQLInputObjectType): GraphQLInputObjectType | void | null {
        return super.visitInputObject(object);
    }
}
