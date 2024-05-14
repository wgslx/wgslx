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
translationUnit.set(union(
	sequence(star(globalDirective), star(globalDecl)),
));

globalDirective.set(union(
	diagnosticDirective,
	enableDirective,
	requiresDirective,
));

globalDecl.set(union(
	';',
	sequence(globalVariableDecl, ';'),
	sequence(globalValueDecl, ';'),
	sequence(typeAliasDecl, ';'),
	structDecl,
	functionDecl,
	sequence(constAssertStatement, ';'),
));

boolLiteral.set(union(
	'true',
	'false',
));

intLiteral.set(union(
	decimalIntLiteral,
	hexIntLiteral,
));

decimalIntLiteral.set(union(
	/0[iu]?/,
	/[1-9][0-9]*[iu]?/,
));

hexIntLiteral.set(union(
	/0[xX][0-9a-fA-F]+[iu]?/,
));

floatLiteral.set(union(
	decimalFloatLiteral,
	hexFloatLiteral,
));

decimalFloatLiteral.set(union(
	/0[fh]/,
	/[1-9][0-9]*[fh]/,
	/[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/,
	/[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/,
	/[0-9]+[eE][+-]?[0-9]+[fh]?/,
));

hexFloatLiteral.set(union(
	/0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/,
	/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/,
	/0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/,
));

diagnosticDirective.set(union(
	sequence('diagnostic', diagnosticControl, ';'),
));

literal.set(union(
	intLiteral,
	floatLiteral,
	boolLiteral,
));

ident.set(union(
	identPatternToken,
));

memberIdent.set(union(
	identPatternToken,
));

diagnosticNameToken.set(union(
	identPatternToken,
));

diagnosticRuleName.set(union(
	diagnosticNameToken,
	sequence(diagnosticNameToken, '.', diagnosticNameToken),
));

templateList.set(union(
	sequence(TEMPLATE_ARGS_START, templateArgCommaList, TEMPLATE_ARGS_END),
));

templateArgCommaList.set(union(
	sequence(templateArgExpression, star(sequence(',', templateArgExpression)), maybe(',')),
));

templateArgExpression.set(union(
	expression,
));

alignAttr.set(union(
	sequence('@', 'align', '(', expression, maybe(','), ')'),
));

bindingAttr.set(union(
	sequence('@', 'binding', '(', expression, maybe(','), ')'),
));

builtinAttr.set(union(
	sequence('@', 'builtin', '(', builtinValueName, maybe(','), ')'),
));

builtinValueName.set(union(
	identPatternToken,
));

constAttr.set(union(
	sequence('@', 'const'),
));

diagnosticAttr.set(union(
	sequence('@', 'diagnostic', diagnosticControl),
));

groupAttr.set(union(
	sequence('@', 'group', '(', expression, maybe(','), ')'),
));

idAttr.set(union(
	sequence('@', 'id', '(', expression, maybe(','), ')'),
));

interpolateAttr.set(union(
	sequence('@', 'interpolate', '(', interpolateTypeName, maybe(','), ')'),
	sequence('@', 'interpolate', '(', interpolateTypeName, ',', interpolateSamplingName, maybe(','), ')'),
));

interpolateTypeName.set(union(
	identPatternToken,
));

interpolateSamplingName.set(union(
	identPatternToken,
));

invariantAttr.set(union(
	sequence('@', 'invariant'),
));

locationAttr.set(union(
	sequence('@', 'location', '(', expression, maybe(','), ')'),
));

mustUseAttr.set(union(
	sequence('@', 'must_use'),
));

sizeAttr.set(union(
	sequence('@', 'size', '(', expression, maybe(','), ')'),
));

workgroupSizeAttr.set(union(
	sequence('@', 'workgroup_size', '(', expression, maybe(','), ')'),
	sequence('@', 'workgroup_size', '(', expression, ',', expression, maybe(','), ')'),
	sequence('@', 'workgroup_size', '(', expression, ',', expression, ',', expression, maybe(','), ')'),
));

vertexAttr.set(union(
	sequence('@', 'vertex'),
));

fragmentAttr.set(union(
	sequence('@', 'fragment'),
));

computeAttr.set(union(
	sequence('@', 'compute'),
));

attribute.set(union(
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
));

diagnosticControl.set(union(
	sequence('(', severityControlName, ',', diagnosticRuleName, maybe(','), ')'),
));

structDecl.set(union(
	sequence('struct', ident, structBodyDecl),
));

structBodyDecl.set(union(
	sequence('{', structMember, star(sequence(',', structMember)), maybe(','), '}'),
));

structMember.set(union(
	sequence(star(attribute), memberIdent, ':', typeSpecifier),
));

typeAliasDecl.set(union(
	sequence('alias', ident, '=', typeSpecifier),
));

typeSpecifier.set(union(
	templateElaboratedIdent,
));

templateElaboratedIdent.set(union(
	sequence(ident, maybe(templateList)),
));

variableOrValueStatement.set(union(
	variableDecl,
	sequence(variableDecl, '=', expression),
	sequence('let', optionallyTypedIdent, '=', expression),
	sequence('const', optionallyTypedIdent, '=', expression),
));

variableDecl.set(union(
	sequence('var', maybe(templateList), optionallyTypedIdent),
));

optionallyTypedIdent.set(union(
	sequence(ident, maybe(sequence(':', typeSpecifier))),
));

globalVariableDecl.set(union(
	sequence(star(attribute), variableDecl, maybe(sequence('=', expression))),
));

globalValueDecl.set(union(
	sequence('const', optionallyTypedIdent, '=', expression),
	sequence(star(attribute), 'override', optionallyTypedIdent, maybe(sequence('=', expression))),
));

primaryExpression.set(union(
	templateElaboratedIdent,
	callExpression,
	literal,
	parenExpression,
));

callExpression.set(union(
	callPhrase,
));

callPhrase.set(union(
	sequence(templateElaboratedIdent, argumentExpressionList),
));

parenExpression.set(union(
	sequence('(', expression, ')'),
));

argumentExpressionList.set(union(
	sequence('(', maybe(expressionCommaList), ')'),
));

expressionCommaList.set(union(
	sequence(expression, star(sequence(',', expression)), maybe(',')),
));

componentOrSwizzleSpecifier.set(union(
	sequence('[', expression, ']', maybe(componentOrSwizzleSpecifier)),
	sequence('.', memberIdent, maybe(componentOrSwizzleSpecifier)),
	sequence('.', swizzleName, maybe(componentOrSwizzleSpecifier)),
));

unaryExpression.set(union(
	singularExpression,
	sequence('-', unaryExpression),
	sequence('!', unaryExpression),
	sequence('~', unaryExpression),
	sequence('*', unaryExpression),
	sequence('&', unaryExpression),
));

singularExpression.set(union(
	sequence(primaryExpression, maybe(componentOrSwizzleSpecifier)),
));

lhsExpression.set(union(
	sequence(coreLhsExpression, maybe(componentOrSwizzleSpecifier)),
	sequence('*', lhsExpression),
	sequence('&', lhsExpression),
));

coreLhsExpression.set(union(
	ident,
	sequence('(', lhsExpression, ')'),
));

multiplicativeExpression.set(union(
	unaryExpression,
	sequence(multiplicativeExpression, multiplicativeOperator, unaryExpression),
));

multiplicativeOperator.set(union(
	'*',
	'/',
	'%',
));

additiveExpression.set(union(
	multiplicativeExpression,
	sequence(additiveExpression, additiveOperator, multiplicativeExpression),
));

additiveOperator.set(union(
	'+',
	'-',
));

shiftExpression.set(union(
	additiveExpression,
	sequence(unaryExpression, SHIFT_LEFT, unaryExpression),
	sequence(unaryExpression, SHIFT_RIGHT, unaryExpression),
));

relationalExpression.set(union(
	shiftExpression,
	sequence(shiftExpression, LESS_THAN, shiftExpression),
	sequence(shiftExpression, GREATER_THAN, shiftExpression),
	sequence(shiftExpression, LESS_THAN_EQUAL, shiftExpression),
	sequence(shiftExpression, GREATER_THAN_EQUAL, shiftExpression),
	sequence(shiftExpression, '==', shiftExpression),
	sequence(shiftExpression, '!=', shiftExpression),
));

shortCircuitAndExpression.set(union(
	relationalExpression,
	sequence(shortCircuitAndExpression, '&&', relationalExpression),
));

shortCircuitOrExpression.set(union(
	relationalExpression,
	sequence(shortCircuitOrExpression, '||', relationalExpression),
));

binaryOrExpression.set(union(
	unaryExpression,
	sequence(binaryOrExpression, '|', unaryExpression),
));

binaryAndExpression.set(union(
	unaryExpression,
	sequence(binaryAndExpression, '&', unaryExpression),
));

binaryXorExpression.set(union(
	unaryExpression,
	sequence(binaryXorExpression, '^', unaryExpression),
));

bitwiseExpression.set(union(
	sequence(binaryAndExpression, '&', unaryExpression),
	sequence(binaryOrExpression, '|', unaryExpression),
	sequence(binaryXorExpression, '^', unaryExpression),
));

expression.set(union(
	relationalExpression,
	sequence(shortCircuitOrExpression, '||', relationalExpression),
	sequence(shortCircuitAndExpression, '&&', relationalExpression),
	bitwiseExpression,
));

compoundStatement.set(union(
	sequence(star(attribute), '{', star(statement), '}'),
));

assignmentStatement.set(union(
	sequence(lhsExpression, '=', expression),
	sequence(lhsExpression, compoundAssignmentOperator, expression),
	sequence('_', '=', expression),
));

compoundAssignmentOperator.set(union(
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
));

incrementStatement.set(union(
	sequence(lhsExpression, '++'),
));

decrementStatement.set(union(
	sequence(lhsExpression, '--'),
));

ifStatement.set(union(
	sequence(star(attribute), ifClause, star(elseIfClause), maybe(elseClause)),
));

ifClause.set(union(
	sequence('if', expression, compoundStatement),
));

elseIfClause.set(union(
	sequence('else', 'if', expression, compoundStatement),
));

elseClause.set(union(
	sequence('else', compoundStatement),
));

switchStatement.set(union(
	sequence(star(attribute), 'switch', expression, switchBody),
));

switchBody.set(union(
	sequence(star(attribute), '{', switchClause, '}'),
));

switchClause.set(union(
	caseClause,
	defaultAloneClause,
));

caseClause.set(union(
	sequence('case', caseSelectors, maybe(':'), compoundStatement),
));

defaultAloneClause.set(union(
	sequence('default', maybe(':'), compoundStatement),
));

caseSelectors.set(union(
	sequence(caseSelector, star(sequence(',', caseSelector)), maybe(',')),
));

caseSelector.set(union(
	'default',
	expression,
));

loopStatement.set(union(
	sequence(star(attribute), 'loop', star(attribute), '{', star(statement), maybe(continuingStatement), '}'),
));

forStatement.set(union(
	sequence(star(attribute), 'for', '(', forHeader, ')', compoundStatement),
));

forHeader.set(union(
	sequence(maybe(forInit), ';', maybe(expression), ';', maybe(forUpdate)),
));

forInit.set(union(
	variableOrValueStatement,
	variableUpdatingStatement,
	funcCallStatement,
));

forUpdate.set(union(
	variableUpdatingStatement,
	funcCallStatement,
));

whileStatement.set(union(
	sequence(star(attribute), 'while', expression, compoundStatement),
));

breakStatement.set(union(
	'break',
));

breakIfStatement.set(union(
	sequence('break', 'if', expression, ';'),
));

continueStatement.set(union(
	'continue',
));

continuingStatement.set(union(
	sequence('continuing', continuingCompoundStatement),
));

continuingCompoundStatement.set(union(
	sequence(star(attribute), '{', star(statement), maybe(breakIfStatement), '}'),
));

returnStatement.set(union(
	sequence('return', maybe(expression)),
));

funcCallStatement.set(union(
	callPhrase,
));

constAssertStatement.set(union(
	sequence('const_assert', expression),
));

statement.set(union(
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
));

variableUpdatingStatement.set(union(
	assignmentStatement,
	incrementStatement,
	decrementStatement,
));

functionDecl.set(union(
	sequence(star(attribute), functionHeader, compoundStatement),
));

functionHeader.set(union(
	sequence('fn', ident, '(', maybe(paramList), ')', maybe(sequence('->', star(attribute), templateElaboratedIdent))),
));

paramList.set(union(
	sequence(param, star(sequence(',', param)), maybe(',')),
));

param.set(union(
	sequence(star(attribute), ident, ':', typeSpecifier),
));

enableDirective.set(union(
	sequence('enable', enableExtensionList, ';'),
));

enableExtensionList.set(union(
	sequence(enableExtensionName, star(sequence(',', enableExtensionName)), maybe(',')),
));

requiresDirective.set(union(
	sequence('requires', softwareExtensionList, ';'),
));

softwareExtensionList.set(union(
	sequence(softwareExtensionName, star(sequence(',', softwareExtensionName)), maybe(',')),
));

enableExtensionName.set(union(
	identPatternToken,
));

softwareExtensionName.set(union(
	identPatternToken,
));

identPatternToken.set(union(
	/([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u,
));

severityControlName.set(union(
	identPatternToken,
));

swizzleName.set(union(
	/[rgba]/,
	/[rgba][rgba]/,
	/[rgba][rgba][rgba]/,
	/[rgba][rgba][rgba][rgba]/,
	/[xyzw]/,
	/[xyzw][xyzw]/,
	/[xyzw][xyzw][xyzw]/,
	/[xyzw][xyzw][xyzw][xyzw]/,
));