// GENREATED FILE. DO NOT EDIT. RUN `npm run generate`

import { maybe, sequence, star, symbol, union } from "./rules";

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
export const translationUnit = symbol('translation_unit');
export const globalDirective = symbol('global_directive');
export const globalDecl = symbol('global_decl');
export const boolLiteral = symbol('bool_literal');
export const intLiteral = symbol('int_literal');
export const decimalIntLiteral = symbol('decimal_int_literal');
export const hexIntLiteral = symbol('hex_int_literal');
export const floatLiteral = symbol('float_literal');
export const decimalFloatLiteral = symbol('decimal_float_literal');
export const hexFloatLiteral = symbol('hex_float_literal');
export const diagnosticDirective = symbol('diagnostic_directive');
export const literal = symbol('literal');
export const ident = symbol('ident');
export const memberIdent = symbol('member_ident');
export const diagnosticNameToken = symbol('diagnostic_name_token');
export const diagnosticRuleName = symbol('diagnostic_rule_name');
export const templateList = symbol('template_list');
export const templateArgCommaList = symbol('template_arg_comma_list');
export const templateArgExpression = symbol('template_arg_expression');
export const alignAttr = symbol('align_attr');
export const bindingAttr = symbol('binding_attr');
export const builtinAttr = symbol('builtin_attr');
export const builtinValueName = symbol('builtin_value_name');
export const constAttr = symbol('const_attr');
export const diagnosticAttr = symbol('diagnostic_attr');
export const groupAttr = symbol('group_attr');
export const idAttr = symbol('id_attr');
export const interpolateAttr = symbol('interpolate_attr');
export const interpolateTypeName = symbol('interpolate_type_name');
export const interpolateSamplingName = symbol('interpolate_sampling_name');
export const invariantAttr = symbol('invariant_attr');
export const locationAttr = symbol('location_attr');
export const mustUseAttr = symbol('must_use_attr');
export const sizeAttr = symbol('size_attr');
export const workgroupSizeAttr = symbol('workgroup_size_attr');
export const vertexAttr = symbol('vertex_attr');
export const fragmentAttr = symbol('fragment_attr');
export const computeAttr = symbol('compute_attr');
export const attribute = symbol('attribute');
export const diagnosticControl = symbol('diagnostic_control');
export const structDecl = symbol('struct_decl');
export const structBodyDecl = symbol('struct_body_decl');
export const structMember = symbol('struct_member');
export const typeAliasDecl = symbol('type_alias_decl');
export const typeSpecifier = symbol('type_specifier');
export const templateElaboratedIdent = symbol('template_elaborated_ident');
export const variableOrValueStatement = symbol('variable_or_value_statement');
export const variableDecl = symbol('variable_decl');
export const optionallyTypedIdent = symbol('optionally_typed_ident');
export const globalVariableDecl = symbol('global_variable_decl');
export const globalValueDecl = symbol('global_value_decl');
export const primaryExpression = symbol('primary_expression');
export const callExpression = symbol('call_expression');
export const callPhrase = symbol('call_phrase');
export const parenExpression = symbol('paren_expression');
export const argumentExpressionList = symbol('argument_expression_list');
export const expressionCommaList = symbol('expression_comma_list');
export const componentOrSwizzleSpecifier = symbol('component_or_swizzle_specifier');
export const unaryExpression = symbol('unary_expression');
export const singularExpression = symbol('singular_expression');
export const lhsExpression = symbol('lhs_expression');
export const coreLhsExpression = symbol('core_lhs_expression');
export const multiplicativeExpression = symbol('multiplicative_expression');
export const multiplicativeOperator = symbol('multiplicative_operator');
export const additiveExpression = symbol('additive_expression');
export const additiveOperator = symbol('additive_operator');
export const shiftExpression = symbol('shift_expression');
export const relationalExpression = symbol('relational_expression');
export const shortCircuitAndExpression = symbol('short_circuit_and_expression');
export const shortCircuitOrExpression = symbol('short_circuit_or_expression');
export const binaryOrExpression = symbol('binary_or_expression');
export const binaryAndExpression = symbol('binary_and_expression');
export const binaryXorExpression = symbol('binary_xor_expression');
export const bitwiseExpression = symbol('bitwise_expression');
export const expression = symbol('expression');
export const compoundStatement = symbol('compound_statement');
export const assignmentStatement = symbol('assignment_statement');
export const compoundAssignmentOperator = symbol('compound_assignment_operator');
export const incrementStatement = symbol('increment_statement');
export const decrementStatement = symbol('decrement_statement');
export const ifStatement = symbol('if_statement');
export const ifClause = symbol('if_clause');
export const elseIfClause = symbol('else_if_clause');
export const elseClause = symbol('else_clause');
export const switchStatement = symbol('switch_statement');
export const switchBody = symbol('switch_body');
export const switchClause = symbol('switch_clause');
export const caseClause = symbol('case_clause');
export const defaultAloneClause = symbol('default_alone_clause');
export const caseSelectors = symbol('case_selectors');
export const caseSelector = symbol('case_selector');
export const loopStatement = symbol('loop_statement');
export const forStatement = symbol('for_statement');
export const forHeader = symbol('for_header');
export const forInit = symbol('for_init');
export const forUpdate = symbol('for_update');
export const whileStatement = symbol('while_statement');
export const breakStatement = symbol('break_statement');
export const breakIfStatement = symbol('break_if_statement');
export const continueStatement = symbol('continue_statement');
export const continuingStatement = symbol('continuing_statement');
export const continuingCompoundStatement = symbol('continuing_compound_statement');
export const returnStatement = symbol('return_statement');
export const funcCallStatement = symbol('func_call_statement');
export const constAssertStatement = symbol('const_assert_statement');
export const statement = symbol('statement');
export const variableUpdatingStatement = symbol('variable_updating_statement');
export const functionDecl = symbol('function_decl');
export const functionHeader = symbol('function_header');
export const paramList = symbol('param_list');
export const param = symbol('param');
export const enableDirective = symbol('enable_directive');
export const enableExtensionList = symbol('enable_extension_list');
export const requiresDirective = symbol('requires_directive');
export const softwareExtensionList = symbol('software_extension_list');
export const enableExtensionName = symbol('enable_extension_name');
export const softwareExtensionName = symbol('software_extension_name');
export const identPatternToken = symbol('ident_pattern_token');
export const severityControlName = symbol('severity_control_name');
export const swizzleName = symbol('swizzle_name');

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

// DECLARATIONS
export const translationUnitExtended = symbol('translation_unit_extended');
export const globalDirectiveExtended = symbol('global_directive_extended');
export const includeDirective = symbol('include_directive');
export const includePath = symbol('include_path');

// IMPLEMENTATIONS
translationUnitExtended.set(union(
	sequence(star(globalDirectiveExtended), star(globalDecl)),
));

globalDirectiveExtended.set(union(
	diagnosticDirective,
	enableDirective,
	requiresDirective,
	includeDirective,
));

includeDirective.set(union(
	sequence('import', includePath, ';'),
));

includePath.set(union(
	/"[^*"/>:|?]+"/,
));
