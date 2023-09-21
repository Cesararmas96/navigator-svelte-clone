export interface Widget {
    id: number;
    uid: string;
    description: null | string;
    widget_slug: null;
    dashboard_id: number;
    widget_name: string;
    widget_id: number;
    title: string;
    url: null | string;
    query_slug: QuerySlug;
    params: WidgetParams;
    attributes: WidgetAttributes;
    conditions: WidgetConditions;
    cond_definition: null;
    where_definition: null;
    format_definition: WidgetFormatDefinition | null;
    save_filtering: boolean;
    allow_filtering: boolean;
    master_filtering: boolean;
    module_id: null;
    filtering_show: null;
    program_id: number;
    widget_type_id: string;
    classbase: Classbase;
    widgetcat_id: number;
    program_slug: ProgramSlug;
    user_id: null;
    published: boolean;
}

export interface WidgetAttributes {
    icon: Icon;
    color: Color;
    explorer: Explorer;
    fg_color: FgColor;
    graph?: string;
}

export enum Color {
    Ffffff = "#ffffff",
}

export enum Explorer {
    V2 = "v2",
}

export enum FgColor {
    The333 = "#333",
}

export enum Icon {
    FaFaBarChart = "fa fa-bar-chart",
    FaFaIDCardO = "fa fa-id-card-o",
    FaFaTable = "fa fa-table",
}

export enum Classbase {
    APITableWidget = "ApiTableWidget",
    CardWidget = "CardWidget",
    EchartsWidget = "EchartsWidget",
    MediaWidget = "MediaWidget",
    PqTableWidget = "pqTableWidget",
}

export interface WidgetConditions {
    fields?: string[];
    ordering?: string[];
    filterdate?: FilterdateEnum;
    where_cond?: PurpleWhereCond;
    qry_options?: QryOptions;
    querylimit?: number;
    lastdate?: FilterdateEnum;
    firstdate?: string;
    grouping?: string[];
}

export enum FilterdateEnum {
    AccessoriesDate = "ACCESSORIES_DATE",
    CurrentDate = "CURRENT_DATE",
    PostpaidDate = "POSTPAID_DATE",
    PrepaidDate = "PREPAID_DATE",
}

export interface QryOptions {
    select_child?: string;
    null_rolldown?: string;
}

export interface PurpleWhereCond {
    territory_id?: string;
}

export interface WidgetFormatDefinition {
    fnFormatPercent?: number[];
    fnFormatNumberInteger?: number[];
    colHidden?: number[];
    fnFormatNumber?: number[];
    fnFormatPercentPlain?: number[];
    hpp?: AccToGoal;
    mpp?: AccToGoal;
    prepaid?: AccToGoal;
    postpaid?: AccToGoal;
    accessories?: AccToGoal;
    description?: Description;
    worked_hours?: AccToGoal;
    fnFormatNumberOne?: number[];
    fnFormatMoney?: number[];
    fnFormatInteger?: number[];
    store_id?: CompanyID;
    market_id?: CompanyID;
    num_sales?: CompanyID;
    region_id?: CompanyID;
    company_id?: CompanyID;
    store_name?: CompanyID;
    acc_to_goal?: AccToGoal;
    district_id?: CompanyID;
    market_name?: CompanyID;
    region_name?: CompanyID;
    postpaid_apd?: AccToGoal;
    prepaid_warp?: AccToGoal;
    territory_id?: CompanyID;
    district_name?: CompanyID;
    postpaid_sales?: AccToGoal;
    territory_name?: CompanyID;
    prepaid_to_goal?: AccToGoal;
    postpaid_to_goal?: AccToGoal;
    avg_acc_rev_trend?: AccToGoal;
    avg_prepaid_trend?: AccToGoal;
    prepaid_warp_perc?: AccToGoal;
    mpp_attach_prepaid?: AccToGoal;
    mpp_attach_postpaid?: AccToGoal;
    prepaid_accessory_on_same_ticket?: AccToGoal;
    postpaid_accessory_on_same_ticket?: AccToGoal;
}

export interface AccToGoal {
    order: number;
    title: string;
    format: AccessoriesFormat;
    hidden?: boolean;
}

export enum AccessoriesFormat {
    Empty = "##,###",
    Format00 = "##,###.00",
    The0 = "##,###.0%",
    The00 = "$##,###.00",
}

export interface CompanyID {
    hidden: boolean;
}

export interface Description {
    order: number;
    title: string;
}

export interface WidgetParams {
    ajax?: Ajax;
    query?: FluffyQuery;
    table?: Table;
    card?: Card;
    graph?: Graph;
}

export interface Ajax {
    method?: Method;
    type?: Method;
}

export enum Method {
    Post = "POST",
}

export interface Card {
    cols?: number;
    type: Type;
    cards: Cards;
    colspan: number | string;
}

export interface Cards {
    over40?: NewBYOD;
    goldstar_status?: NewBYOD;
    dark_days_percent?: NewBYOD;
    hpp?: NewBYOD;
    store_id?: CompanyID;
    market_id?: CompanyID;
    num_sales?: CompanyID;
    region_id?: CompanyID;
    company_id?: CompanyID;
    store_name?: CompanyID;
    "% new ports"?: NewBYOD;
    description?: CompanyID;
    district_id?: CompanyID;
    market_name?: CompanyID;
    region_name?: CompanyID;
    postpaid_apd?: NewBYOD;
    territory_id?: CompanyID;
    district_name?: CompanyID;
    territory_name?: CompanyID;
    postpaid_to_goal?: NewBYOD;
    "% new"?: CompanyID;
    "% upgrade"?: NewBYOD;
    total_new?: CompanyID;
    "% new byod"?: NewBYOD;
    total_postpaid?: CompanyID;
    total_upgrades?: CompanyID;
    acc_sales?: AccSales;
    prepaid_to_goal?: NewBYOD;
    acc_sales_to_goal?: AccSales;
    acc_units_to_goal?: AccSales;
    prepaid_per_store?: AccSales;
    postpaid_per_store?: AccSales;
    "accessory attach"?: NewBYOD;
    postpaid_quantity?: CompanyID;
    total_accessories?: CompanyID;
    total_careplans?: CompanyID;
    total_protection?: CompanyID;
    "protection plan take rate"?: NewBYOD;
    num_stores?: CompanyID;
    store_tier?: CompanyID;
    acc_to_goal?: NewBYOD;
    launch_group?: CompanyID;
    prepaid_sales?: CompanyID;
    prepaid_trended?: CompanyID;
    avg_acc_qty_trend?: NewBYOD;
    avg_acc_rev_trend?: NewBYOD;
    avg_wearable_qty_trended?: NewBYOD;
    avg_prepaid_trend?: NewBYOD;
    att_trend?: NewBYOD;
    home_internet?: CompanyID;
    home_internet_trend?: NewBYOD;
    home_internet_trend_per_store?: NewBYOD;
    prepaid_pos?: CompanyID;
    prepaid_warp?: CompanyID;
    prepaid_in_warp?: NewBYOD;
    num_zero_stores?: NumZeroStores;
    tot?: CompanyID;
    total_prepaid?: CompanyID;
    prepaid_quantity?: CompanyID;
    unlocked?: CompanyID;
    store_count?: CompanyID;
    unlocked_troc?: CompanyID;
    unlocked_trend?: CompanyID;
    store_count_troc?: CompanyID;
    unlocked_per_store?: NewBYOD;
    unlocked_trend_troc?: CompanyID;
    unlocked_per_store_troc?: NewBYOD;
    unlocked_trend_per_store?: CompanyID;
    unlocked_trend_per_store_troc?: CompanyID;
}

export interface NewBYOD {
    class?: string;
    order?: number;
    title?: string;
    value: string[];
    footer?: null | string;
    format: NewBYODFormat;
    hidden?: boolean;
    icon?: string;
    formatVal?: number;
    jump?: boolean;
    backMask?: string;
}

export enum NewBYODFormat {
    FnFormatMoney = "fnFormatMoney",
    FnFormatNumber = "fnFormatNumber",
    FnFormatNumberInteger = "fnFormatNumberInteger",
    FnFormatNumberOne = "fnFormatNumberOne",
    FnFormatPercentOne = "fnFormatPercentOne",
}

export interface AccSales {
    order: number;
    value: string[];
    footer: string;
    format: string;
    backMask?: string;
}

export interface NumZeroStores {
    icon: string;
    class: string;
    title: string;
    format: NewBYODFormat;
    drilldowns: Drilldown[];
    drilldownsClear: boolean;
    extendConditions: string;
}

export interface Drilldown {
    title: string;
    params: DrilldownParams;
    classbase: Classbase;
    attributes: DrilldownAttributes;
    conditions: DrilldownConditions;
    format_definition: DrilldownFormatDefinition;
}

export interface DrilldownAttributes {
    icon: Icon;
}

export interface DrilldownConditions {
    fields: string[];
    grouping: any[];
    lastdate: FilterdateEnum;
    ordering: string;
    firstdate: string;
    where_cond: FluffyWhereCond;
}

export interface FluffyWhereCond {
}

export interface DrilldownFormatDefinition {
    store_id: StoreID;
    store_name: StoreName;
}

export interface StoreID {
    align: string;
    order: number;
    format: string;
}

export interface StoreName {
    align: string;
    order: number;
}

export interface DrilldownParams {
    query: PurpleQuery;
}

export interface PurpleQuery {
    slug: string;
}

export enum Type {
    Card = "card",
}

export interface Graph {
    type: string;
    xkey: string;
    series: Series;
    xformat: string;
    markPoint: MarkPoint;
    yAxisLeft: YAxisLeft;
    yAxisRight: YAxisRight;
    rotatexAxis: boolean;
}

export interface MarkPoint {
    active: boolean;
}

export interface Series {
    num_sales: NumSales;
    past_sales: NumSales;
    yoy_postpaid_units_trend: NumSales;
}

export interface NumSales {
    type: string;
    color: string;
    order: number;
    format: string;
    label_name: string;
    label_color: string;
    label_position?: string;
    barGap?: number;
    yAxisIndex?: string;
}

export interface YAxisLeft {
    yMask_prefix: string;
}

export interface YAxisRight {
    yMask: string;
}

export interface FluffyQuery {
    slug: string;
    options?: Options;
    hlevel?: string[];
}

export interface Options {
    select_child: string;
}

export interface Table {
    roll_up: RollUp;
}

export interface RollUp {
    sum: string[];
    total: string;
    total_col: string;
}

export enum ProgramSlug {
    Walmart = "walmart",
}

export interface QuerySlug {
    method?: string;
    url?: string;
    body?: string;
    slug?: string;
}
