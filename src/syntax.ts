// GENREATED FILE. DO NOT EDIT. RUN `npm run generate`

import { maybe, name, sequence, star, union } from "./rules";

// CONSTANTS
const TEMPLATE_ARGS_START = '❬';
const TEMPLATE_ARGS_END = '❭';
const SHIFT_LEFT = '<<';
const SHIFT_RIGHT = '>>';
const LESS_THAN = '<';
const GREATER_THAN = '>';
const LESS_THAN_EQUAL = '<=';
const GREATER_THAN_EQUAL = '>=';
const SHIFT_LEFT_ASSIGN = '<<=';
const SHIFT_RIGHT_ASSIGN = '>>=';

// DECLARATIONS
export const translationUnit = name('translation_unit');
export const globalDirective = name('global_directive');
export const globalDecl = name('global_decl');
export const boolLiteral = name('bool_literal');
export const intLiteral = name('int_literal');
export const decimalIntLiteral = name('decimal_int_literal');
export const hexIntLiteral = name('hex_int_literal');
export const floatLiteral = name('float_literal');
export const decimalFloatLiteral = name('decimal_float_literal');
export const hexFloatLiteral = name('hex_float_literal');
export const diagnosticDirective = name('diagnostic_directive');
export const literal = name('literal');
export const ident = name('ident');
export const memberIdent = name('member_ident');
export const diagnosticNameToken = name('diagnostic_name_token');
export const diagnosticRuleName = name('diagnostic_rule_name');
export const templateList = name('template_list');
export const templateArgCommaList = name('template_arg_comma_list');
export const templateArgExpression = name('template_arg_expression');
export const alignAttr = name('align_attr');
export const bindingAttr = name('binding_attr');
export const builtinAttr = name('builtin_attr');
export const builtinValueName = name('builtin_value_name');
export const constAttr = name('const_attr');
export const diagnosticAttr = name('diagnostic_attr');
export const groupAttr = name('group_attr');
export const idAttr = name('id_attr');
export const interpolateAttr = name('interpolate_attr');
export const interpolateTypeName = name('interpolate_type_name');
export const interpolateSamplingName = name('interpolate_sampling_name');
export const invariantAttr = name('invariant_attr');
export const locationAttr = name('location_attr');
export const mustUseAttr = name('must_use_attr');
export const sizeAttr = name('size_attr');
export const workgroupSizeAttr = name('workgroup_size_attr');
export const vertexAttr = name('vertex_attr');
export const fragmentAttr = name('fragment_attr');
export const computeAttr = name('compute_attr');
export const attribute = name('attribute');
export const diagnosticControl = name('diagnostic_control');
export const structDecl = name('struct_decl');
export const structBodyDecl = name('struct_body_decl');
export const structMember = name('struct_member');
export const typeAliasDecl = name('type_alias_decl');
export const typeSpecifier = name('type_specifier');
export const templateElaboratedIdent = name('template_elaborated_ident');
export const variableOrValueStatement = name('variable_or_value_statement');
export const variableDecl = name('variable_decl');
export const optionallyTypedIdent = name('optionally_typed_ident');
export const globalVariableDecl = name('global_variable_decl');
export const globalValueDecl = name('global_value_decl');
export const primaryExpression = name('primary_expression');
export const callExpression = name('call_expression');
export const callPhrase = name('call_phrase');
export const parenExpression = name('paren_expression');
export const argumentExpressionList = name('argument_expression_list');
export const expressionCommaList = name('expression_comma_list');
export const componentOrSwizzleSpecifier = name('component_or_swizzle_specifier');
export const unaryExpression = name('unary_expression');
export const singularExpression = name('singular_expression');
export const lhsExpression = name('lhs_expression');
export const coreLhsExpression = name('core_lhs_expression');
export const multiplicativeExpression = name('multiplicative_expression');
export const multiplicativeOperator = name('multiplicative_operator');
export const additiveExpression = name('additive_expression');
export const additiveOperator = name('additive_operator');
export const shiftExpression = name('shift_expression');
export const relationalExpression = name('relational_expression');
export const shortCircuitAndExpression = name('short_circuit_and_expression');
export const shortCircuitOrExpression = name('short_circuit_or_expression');
export const binaryOrExpression = name('binary_or_expression');
export const binaryAndExpression = name('binary_and_expression');
export const binaryXorExpression = name('binary_xor_expression');
export const bitwiseExpression = name('bitwise_expression');
export const expression = name('expression');
export const compoundStatement = name('compound_statement');
export const assignmentStatement = name('assignment_statement');
export const compoundAssignmentOperator = name('compound_assignment_operator');
export const incrementStatement = name('increment_statement');
export const decrementStatement = name('decrement_statement');
export const ifStatement = name('if_statement');
export const ifClause = name('if_clause');
export const elseIfClause = name('else_if_clause');
export const elseClause = name('else_clause');
export const switchStatement = name('switch_statement');
export const switchBody = name('switch_body');
export const switchClause = name('switch_clause');
export const caseClause = name('case_clause');
export const defaultAloneClause = name('default_alone_clause');
export const caseSelectors = name('case_selectors');
export const caseSelector = name('case_selector');
export const loopStatement = name('loop_statement');
export const forStatement = name('for_statement');
export const forHeader = name('for_header');
export const forInit = name('for_init');
export const forUpdate = name('for_update');
export const whileStatement = name('while_statement');
export const breakStatement = name('break_statement');
export const breakIfStatement = name('break_if_statement');
export const continueStatement = name('continue_statement');
export const continuingStatement = name('continuing_statement');
export const continuingCompoundStatement = name('continuing_compound_statement');
export const returnStatement = name('return_statement');
export const funcCallStatement = name('func_call_statement');
export const constAssertStatement = name('const_assert_statement');
export const statement = name('statement');
export const variableUpdatingStatement = name('variable_updating_statement');
export const functionDecl = name('function_decl');
export const functionHeader = name('function_header');
export const paramList = name('param_list');
export const param = name('param');
export const enableDirective = name('enable_directive');
export const enableExtensionList = name('enable_extension_list');
export const requiresDirective = name('requires_directive');
export const softwareExtensionList = name('software_extension_list');
export const enableExtensionName = name('enable_extension_name');
export const softwareExtensionName = name('software_extension_name');
export const identPatternToken = name('ident_pattern_token');
export const severityControlName = name('severity_control_name');
export const swizzleName = name('swizzle_name');

// IMPLEMENTATIONS
translationUnit.rule = union(
	sequence(star(globalDirective), star(globalDecl)),
);

globalDirective.rule = union(
	diagnosticDirective,
	enableDirective,
	requiresDirective,
);

globalDecl.rule = union(
	';',
	sequence(globalVariableDecl, ';'),
	sequence(globalValueDecl, ';'),
	sequence(typeAliasDecl, ';'),
	structDecl,
	functionDecl,
	sequence(constAssertStatement, ';'),
);

boolLiteral.rule = union(
	'true',
	'false',
);

intLiteral.rule = union(
	decimalIntLiteral,
	hexIntLiteral,
);

decimalIntLiteral.rule = union(
	/0[iu]?/,
	/[1-9][0-9]*[iu]?/,
);

hexIntLiteral.rule = union(
	/0[xX][0-9a-fA-F]+[iu]?/,
);

floatLiteral.rule = union(
	decimalFloatLiteral,
	hexFloatLiteral,
);

decimalFloatLiteral.rule = union(
	/0[fh]/,
	/[1-9][0-9]*[fh]/,
	/[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/,
	/[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/,
	/[0-9]+[eE][+-]?[0-9]+[fh]?/,
);

hexFloatLiteral.rule = union(
	/0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/,
	/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/,
	/0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/,
);

diagnosticDirective.rule = union(
	sequence('diagnostic', diagnosticControl, ';'),
);

literal.rule = union(
	intLiteral,
	floatLiteral,
	boolLiteral,
);

ident.rule = union(
	identPatternToken,
);

memberIdent.rule = union(
	identPatternToken,
);

diagnosticNameToken.rule = union(
	identPatternToken,
);

diagnosticRuleName.rule = union(
	diagnosticNameToken,
	sequence(diagnosticNameToken, '.', diagnosticNameToken),
);

templateList.rule = union(
	sequence(TEMPLATE_ARGS_START, templateArgCommaList, TEMPLATE_ARGS_END),
);

templateArgCommaList.rule = union(
	sequence(templateArgExpression, star(sequence(',', templateArgExpression)), maybe(',')),
);

templateArgExpression.rule = union(
	expression,
);

alignAttr.rule = union(
	sequence('@', 'align', '(', expression, maybe(','), ')'),
);

bindingAttr.rule = union(
	sequence('@', 'binding', '(', expression, maybe(','), ')'),
);

builtinAttr.rule = union(
	sequence('@', 'builtin', '(', builtinValueName, maybe(','), ')'),
);

builtinValueName.rule = union(
	identPatternToken,
);

constAttr.rule = union(
	sequence('@', 'const'),
);

diagnosticAttr.rule = union(
	sequence('@', 'diagnostic', diagnosticControl),
);

groupAttr.rule = union(
	sequence('@', 'group', '(', expression, maybe(','), ')'),
);

idAttr.rule = union(
	sequence('@', 'id', '(', expression, maybe(','), ')'),
);

interpolateAttr.rule = union(
	sequence('@', 'interpolate', '(', interpolateTypeName, maybe(','), ')'),
	sequence('@', 'interpolate', '(', interpolateTypeName, ',', interpolateSamplingName, maybe(','), ')'),
);

interpolateTypeName.rule = union(
	identPatternToken,
);

interpolateSamplingName.rule = union(
	identPatternToken,
);

invariantAttr.rule = union(
	sequence('@', 'invariant'),
);

locationAttr.rule = union(
	sequence('@', 'location', '(', expression, maybe(','), ')'),
);

mustUseAttr.rule = union(
	sequence('@', 'must_use'),
);

sizeAttr.rule = union(
	sequence('@', 'size', '(', expression, maybe(','), ')'),
);

workgroupSizeAttr.rule = union(
	sequence('@', 'workgroup_size', '(', expression, maybe(','), ')'),
	sequence('@', 'workgroup_size', '(', expression, ',', expression, maybe(','), ')'),
	sequence('@', 'workgroup_size', '(', expression, ',', expression, ',', expression, maybe(','), ')'),
);

vertexAttr.rule = union(
	sequence('@', 'vertex'),
);

fragmentAttr.rule = union(
	sequence('@', 'fragment'),
);

computeAttr.rule = union(
	sequence('@', 'compute'),
);

attribute.rule = union(
	sequence('@', identPatternToken, maybe(argumentExpressionList)),
	alignAttr,
	bindingAttr,
	builtinAttr,
	constAttr,
	diagnosticAttr,
	groupAttr,
	idAttr,
	interpolateAttr,
	invariantAttr,
	locationAttr,
	mustUseAttr,
	sizeAttr,
	workgroupSizeAttr,
	vertexAttr,
	fragmentAttr,
	computeAttr,
);

diagnosticControl.rule = union(
	sequence('(', severityControlName, ',', diagnosticRuleName, maybe(','), ')'),
);

structDecl.rule = union(
	sequence('struct', ident, structBodyDecl),
);

structBodyDecl.rule = union(
	sequence('{', structMember, star(sequence(',', structMember)), maybe(','), '}'),
);

structMember.rule = union(
	sequence(star(attribute), memberIdent, ':', typeSpecifier),
);

typeAliasDecl.rule = union(
	sequence('alias', ident, '=', typeSpecifier),
);

typeSpecifier.rule = union(
	templateElaboratedIdent,
);

templateElaboratedIdent.rule = union(
	sequence(ident, maybe(templateList)),
);

variableOrValueStatement.rule = union(
	variableDecl,
	sequence(variableDecl, '=', expression),
	sequence('let', optionallyTypedIdent, '=', expression),
	sequence('const', optionallyTypedIdent, '=', expression),
);

variableDecl.rule = union(
	sequence('var', maybe(templateList), optionallyTypedIdent),
);

optionallyTypedIdent.rule = union(
	sequence(ident, maybe(sequence(':', typeSpecifier))),
);

globalVariableDecl.rule = union(
	sequence(star(attribute), variableDecl, maybe(sequence('=', expression))),
);

globalValueDecl.rule = union(
	sequence('const', optionallyTypedIdent, '=', expression),
	sequence(star(attribute), 'override', optionallyTypedIdent, maybe(sequence('=', expression))),
);

primaryExpression.rule = union(
	templateElaboratedIdent,
	callExpression,
	literal,
	parenExpression,
);

callExpression.rule = union(
	callPhrase,
);

callPhrase.rule = union(
	sequence(templateElaboratedIdent, argumentExpressionList),
);

parenExpression.rule = union(
	sequence('(', expression, ')'),
);

argumentExpressionList.rule = union(
	sequence('(', maybe(expressionCommaList), ')'),
);

expressionCommaList.rule = union(
	sequence(expression, star(sequence(',', expression)), maybe(',')),
);

componentOrSwizzleSpecifier.rule = union(
	sequence('[', expression, ']', maybe(componentOrSwizzleSpecifier)),
	sequence('.', memberIdent, maybe(componentOrSwizzleSpecifier)),
	sequence('.', swizzleName, maybe(componentOrSwizzleSpecifier)),
);

unaryExpression.rule = union(
	singularExpression,
	sequence('-', unaryExpression),
	sequence('!', unaryExpression),
	sequence('~', unaryExpression),
	sequence('*', unaryExpression),
	sequence('&', unaryExpression),
);

singularExpression.rule = union(
	sequence(primaryExpression, maybe(componentOrSwizzleSpecifier)),
);

lhsExpression.rule = union(
	sequence(coreLhsExpression, maybe(componentOrSwizzleSpecifier)),
	sequence('*', lhsExpression),
	sequence('&', lhsExpression),
);

coreLhsExpression.rule = union(
	ident,
	sequence('(', lhsExpression, ')'),
);

multiplicativeExpression.rule = union(
	unaryExpression,
	sequence(multiplicativeExpression, multiplicativeOperator, unaryExpression),
);

multiplicativeOperator.rule = union(
	'*',
	'/',
	'%',
);

additiveExpression.rule = union(
	multiplicativeExpression,
	sequence(additiveExpression, additiveOperator, multiplicativeExpression),
);

additiveOperator.rule = union(
	'+',
	'-',
);

shiftExpression.rule = union(
	additiveExpression,
	sequence(unaryExpression, SHIFT_LEFT, unaryExpression),
	sequence(unaryExpression, SHIFT_RIGHT, unaryExpression),
);

relationalExpression.rule = union(
	shiftExpression,
	sequence(shiftExpression, LESS_THAN, shiftExpression),
	sequence(shiftExpression, GREATER_THAN, shiftExpression),
	sequence(shiftExpression, LESS_THAN_EQUAL, shiftExpression),
	sequence(shiftExpression, GREATER_THAN_EQUAL, shiftExpression),
	sequence(shiftExpression, '==', shiftExpression),
	sequence(shiftExpression, '!=', shiftExpression),
);

shortCircuitAndExpression.rule = union(
	relationalExpression,
	sequence(shortCircuitAndExpression, '&&', relationalExpression),
);

shortCircuitOrExpression.rule = union(
	relationalExpression,
	sequence(shortCircuitOrExpression, '||', relationalExpression),
);

binaryOrExpression.rule = union(
	unaryExpression,
	sequence(binaryOrExpression, '|', unaryExpression),
);

binaryAndExpression.rule = union(
	unaryExpression,
	sequence(binaryAndExpression, '&', unaryExpression),
);

binaryXorExpression.rule = union(
	unaryExpression,
	sequence(binaryXorExpression, '^', unaryExpression),
);

bitwiseExpression.rule = union(
	sequence(binaryAndExpression, '&', unaryExpression),
	sequence(binaryOrExpression, '|', unaryExpression),
	sequence(binaryXorExpression, '^', unaryExpression),
);

expression.rule = union(
	relationalExpression,
	sequence(shortCircuitOrExpression, '||', relationalExpression),
	sequence(shortCircuitAndExpression, '&&', relationalExpression),
	bitwiseExpression,
);

compoundStatement.rule = union(
	sequence(star(attribute), '{', star(statement), '}'),
);

assignmentStatement.rule = union(
	sequence(lhsExpression, '=', expression),
	sequence(lhsExpression, compoundAssignmentOperator, expression),
	sequence('_', '=', expression),
);

compoundAssignmentOperator.rule = union(
	'+=',
	'-=',
	'*=',
	'/=',
	'%=',
	'&=',
	'|=',
	'^=',
	SHIFT_RIGHT_ASSIGN,
	SHIFT_LEFT_ASSIGN,
);

incrementStatement.rule = union(
	sequence(lhsExpression, '++'),
);

decrementStatement.rule = union(
	sequence(lhsExpression, '--'),
);

ifStatement.rule = union(
	sequence(star(attribute), ifClause, star(elseIfClause), maybe(elseClause)),
);

ifClause.rule = union(
	sequence('if', expression, compoundStatement),
);

elseIfClause.rule = union(
	sequence('else', 'if', expression, compoundStatement),
);

elseClause.rule = union(
	sequence('else', compoundStatement),
);

switchStatement.rule = union(
	sequence(star(attribute), 'switch', expression, switchBody),
);

switchBody.rule = union(
	sequence(star(attribute), '{', switchClause, '}'),
);

switchClause.rule = union(
	caseClause,
	defaultAloneClause,
);

caseClause.rule = union(
	sequence('case', caseSelectors, maybe(':'), compoundStatement),
);

defaultAloneClause.rule = union(
	sequence('default', maybe(':'), compoundStatement),
);

caseSelectors.rule = union(
	sequence(caseSelector, star(sequence(',', caseSelector)), maybe(',')),
);

caseSelector.rule = union(
	'default',
	expression,
);

loopStatement.rule = union(
	sequence(star(attribute), 'loop', star(attribute), '{', star(statement), maybe(continuingStatement), '}'),
);

forStatement.rule = union(
	sequence(star(attribute), 'for', '(', forHeader, ')', compoundStatement),
);

forHeader.rule = union(
	sequence(maybe(forInit), ';', maybe(expression), ';', maybe(forUpdate)),
);

forInit.rule = union(
	variableOrValueStatement,
	variableUpdatingStatement,
	funcCallStatement,
);

forUpdate.rule = union(
	variableUpdatingStatement,
	funcCallStatement,
);

whileStatement.rule = union(
	sequence(star(attribute), 'while', expression, compoundStatement),
);

breakStatement.rule = union(
	'break',
);

breakIfStatement.rule = union(
	sequence('break', 'if', expression, ';'),
);

continueStatement.rule = union(
	'continue',
);

continuingStatement.rule = union(
	sequence('continuing', continuingCompoundStatement),
);

continuingCompoundStatement.rule = union(
	sequence(star(attribute), '{', star(statement), maybe(breakIfStatement), '}'),
);

returnStatement.rule = union(
	sequence('return', maybe(expression)),
);

funcCallStatement.rule = union(
	callPhrase,
);

constAssertStatement.rule = union(
	sequence('const_assert', expression),
);

statement.rule = union(
	';',
	sequence(returnStatement, ';'),
	ifStatement,
	switchStatement,
	loopStatement,
	forStatement,
	whileStatement,
	sequence(funcCallStatement, ';'),
	sequence(variableOrValueStatement, ';'),
	sequence(breakStatement, ';'),
	sequence(continueStatement, ';'),
	sequence('discard', ';'),
	sequence(variableUpdatingStatement, ';'),
	compoundStatement,
	sequence(constAssertStatement, ';'),
);

variableUpdatingStatement.rule = union(
	assignmentStatement,
	incrementStatement,
	decrementStatement,
);

functionDecl.rule = union(
	sequence(star(attribute), functionHeader, compoundStatement),
);

functionHeader.rule = union(
	sequence('fn', ident, '(', maybe(paramList), ')', maybe(sequence('->', star(attribute), templateElaboratedIdent))),
);

paramList.rule = union(
	sequence(param, star(sequence(',', param)), maybe(',')),
);

param.rule = union(
	sequence(star(attribute), ident, ':', typeSpecifier),
);

enableDirective.rule = union(
	sequence('enable', enableExtensionList, ';'),
);

enableExtensionList.rule = union(
	sequence(enableExtensionName, star(sequence(',', enableExtensionName)), maybe(',')),
);

requiresDirective.rule = union(
	sequence('requires', softwareExtensionList, ';'),
);

softwareExtensionList.rule = union(
	sequence(softwareExtensionName, star(sequence(',', softwareExtensionName)), maybe(',')),
);

enableExtensionName.rule = union(
	identPatternToken,
);

softwareExtensionName.rule = union(
	identPatternToken,
);

identPatternToken.rule = union(
	/([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u,
);

severityControlName.rule = union(
	identPatternToken,
);

swizzleName.rule = union(
	/[rgba]/,
	/[rgba][rgba]/,
	/[rgba][rgba][rgba]/,
	/[rgba][rgba][rgba][rgba]/,
	/[xyzw]/,
	/[xyzw][xyzw]/,
	/[xyzw][xyzw][xyzw]/,
	/[xyzw][xyzw][xyzw][xyzw]/,
);