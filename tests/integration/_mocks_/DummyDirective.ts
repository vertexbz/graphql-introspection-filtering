import { SchemaDirectiveVisitor } from 'graphql-tools';
import type { IntrospectionDirectiveVisitor } from '../../../src';
import type {
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
} from 'graphql';
import type { VisitorResult } from '../../../src/types';

export default class DummyDirective extends SchemaDirectiveVisitor implements IntrospectionDirectiveVisitor {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitIntrospectionArgument(result: GraphQLArgument, info: GraphQLResolveInfo): VisitorResult<GraphQLArgument> {
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitIntrospectionDirective(result: GraphQLDirective, info: GraphQLResolveInfo): VisitorResult<GraphQLDirective> {
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitIntrospectionEnum(result: GraphQLEnumType, info: GraphQLResolveInfo): VisitorResult<GraphQLEnumType> {
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitIntrospectionEnumValue(result: GraphQLEnumValue, info: GraphQLResolveInfo): VisitorResult<GraphQLEnumValue> {
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitIntrospectionField(result: GraphQLField<any, any>, info: GraphQLResolveInfo): VisitorResult<GraphQLField<any, any>> {
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitIntrospectionInputField(result: GraphQLInputField, info: GraphQLResolveInfo): VisitorResult<GraphQLInputField> {
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitIntrospectionInputObject(result: GraphQLInputObjectType, info: GraphQLResolveInfo): VisitorResult<GraphQLInputObjectType> {
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitIntrospectionInterface(result: GraphQLInterfaceType, info: GraphQLResolveInfo): VisitorResult<GraphQLInterfaceType> {
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitIntrospectionObject(result: GraphQLObjectType, info: GraphQLResolveInfo): VisitorResult<GraphQLObjectType> {
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitIntrospectionScalar(result: GraphQLScalarType, info: GraphQLResolveInfo): VisitorResult<GraphQLScalarType> {
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitIntrospectionUnion(result: GraphQLUnionType, info: GraphQLResolveInfo): VisitorResult<GraphQLUnionType> {
        return result;
    }


    // required by SchemaDirectiveVisitor
    visitObject(object: GraphQLObjectType): GraphQLObjectType | void | null {
        return super.visitObject(object);
    }

    visitInputFieldDefinition(field: GraphQLInputField, details: { objectType: GraphQLInputObjectType }): GraphQLInputField | void | null {
        return super.visitInputFieldDefinition(field, details);
    }

    visitFieldDefinition(field: GraphQLField<any, any>,
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

    visitArgumentDefinition(argument: GraphQLArgument,
        details: { field: GraphQLField<any, any>; objectType: GraphQLObjectType | GraphQLInterfaceType }
    ): GraphQLArgument | void | null {
        return super.visitArgumentDefinition(argument, details);
    }

    visitInputObject(object: GraphQLInputObjectType): GraphQLInputObjectType | void | null {
        return super.visitInputObject(object);
    }

    visitScalar(scalar: GraphQLScalarType): GraphQLScalarType | void | null {
        return super.visitScalar(scalar);
    }
}
