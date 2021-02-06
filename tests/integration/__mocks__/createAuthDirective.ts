import { SchemaDirectiveVisitor } from "graphql-tools";
import {
    GraphQLArgument,
    GraphQLDirective,
    GraphQLEnumType,
    GraphQLEnumValue,
    GraphQLField,
    GraphQLInputField,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLResolveInfo,
    GraphQLScalarType,
    GraphQLUnionType
} from "graphql";
import { IntrospectionDirectiveVisitor } from "../../../src";

export default (roles: string[]) =>
class AuthDirective extends SchemaDirectiveVisitor implements IntrospectionDirectiveVisitor{
    async validate(result: any) {
        await new Promise((res) => setTimeout(res, 10));
        if (!roles.includes(this.args.requires || 'ADMIN')) {
            return null;
        }
        return result;
    }

    visitIntrospectionArgument<TSource, TContext, TArgs>(
        result: GraphQLArgument,
        info: GraphQLResolveInfo
    ): Promise<GraphQLArgument | null> | GraphQLArgument | null {
        return this.validate(result);
    }

    visitIntrospectionDirective<TSource, TContext, TArgs>(
        result: GraphQLDirective,
        info: GraphQLResolveInfo
    ): Promise<GraphQLDirective | null> | GraphQLDirective | null {
        return this.validate(result);
    }

    visitIntrospectionEnum<TSource, TContext, TArgs>(
        result: GraphQLEnumType,
        info: GraphQLResolveInfo
    ): Promise<GraphQLEnumType | null> | GraphQLEnumType | null {
        return this.validate(result);
    }

    visitIntrospectionEnumValue<TSource, TContext, TArgs>(
        result: GraphQLEnumValue,
        info: GraphQLResolveInfo
    ): Promise<GraphQLEnumValue | null> | GraphQLEnumValue | null {
        return this.validate(result);
    }

    visitIntrospectionField<TSource, TContext, TArgs>(
        result: GraphQLField<any, any>,
        info: GraphQLResolveInfo
    ): Promise<GraphQLField<any, any> | null> | GraphQLField<any, any> | null {
        return this.validate(result);
    }

    visitIntrospectionInputField<TSource, TContext, TArgs>(
        result: GraphQLInputField,
        info: GraphQLResolveInfo
    ): Promise<GraphQLInputField | null> | GraphQLInputField | null {
        return this.validate(result);
    }

    visitIntrospectionInputObject<TSource, TContext, TArgs>(
        result: GraphQLInputObjectType,
        info: GraphQLResolveInfo
    ): Promise<GraphQLInputObjectType | null> | GraphQLInputObjectType | null {
        return this.validate(result);
    }

    visitIntrospectionInterface<TSource, TContext, TArgs>(
        result: GraphQLInterfaceType,
        info: GraphQLResolveInfo
    ): Promise<GraphQLInterfaceType | null> | GraphQLInterfaceType | null {
        return this.validate(result);
    }

    visitIntrospectionObject<TSource, TContext, TArgs>(
        result: GraphQLObjectType,
        info: GraphQLResolveInfo
    ): Promise<GraphQLObjectType | null> | GraphQLObjectType | null {
        return this.validate(result);
    }

    // visitIntrospectionScalar<TSource, TContext, TArgs>(
    //     result: GraphQLScalarType,
    //     info: GraphQLResolveInfo
    // ): Promise<GraphQLScalarType | null> | GraphQLScalarType | null {
    //     return this.validate(result);
    // }

    visitIntrospectionUnion<TSource, TContext, TArgs>(
        result: GraphQLUnionType,
        info: GraphQLResolveInfo
    ): Promise<GraphQLUnionType | null> | GraphQLUnionType | null {
        return this.validate(result);
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
