<?php
require dirname(__FILE__) . "/../../src/php/acsv.php";
use acsv\Table as Table;
/**
 * Standard csv format text
 */
$standard_format_text = 'id,id2,id3,name,brief
1,20,100,John,He is a googd man
2,20,100,张三,"他是一个好人
我们都喜欢他"
3,21,100,море,"Он хороший человек
мы все любим его
Его девиз:
""доверяй себе"""
4,21,200,الشمس,صباح الخير
5,22,200,चंद्रमा,सुसंध्या
6,22,200,ดาว,';
$enhanced_format_text = 'id:int,id2:int,id3:int,name:string,weight:number,marry:bool,education:json,tags:strings,brief
1,21,100,John,120.1,true,"[""AB""]","good,cool","Today is good day
Tomorrow is good day too"
2,21,100,张三,121.2,false,"[""CD"",""EF""]",good,今天是个好日子
3,22,100,море,123.4,true,"[""GH"",""AB"",""CD""]",good,"Сегодня хороший день
Завтра тоже хороший день"
4,22,200,الشمس,124.5,false,"{""AA"":12}",strong,صباح الخير
5,23,200,चंद्रमा,126.7,1,"{""BB"":12}",strong,सुसंध्या
6,23,200,Emilia,,0,"{""CC"":34,""DD"":56}","strong,cool",Hoje é um bom dia
7,24,300,Ayşe,128.9,0,"{""EE"":34,""FF"":56}","strong,cool",Bugün güzel bir gün
8,24,300,陽菜乃,129.01,,"{""AC"":78,""BD"":[90,12]}","height,strong",今日はいい日です
9,25,300,Dwi,130.12,1,"{""EF"":78,""CF"":[90,12]}",,"Hari ini adalah hari yang baik
Besok juga hari yang baik"
10,25,400,Bảo,131.23,1,"[""BC"",{""AT"":34}]","thin,good",
11,26,400,민준,132.34,0,"[""FG"",{""AG"":34}]","hot,thin,good",오늘은 좋은 날이다
12,26,400,ดาว,133.456,0,,,';
/**
 * Tables
 */
$_tab1;
$_tab2;
/**
 * Main Entry.
 */
function main()
{
    global $_tab1, $_tab2, $standard_format_text, $enhanced_format_text;
    $_tab1 = Table::Parse($standard_format_text);
    $_tab2 = Table::Parse($enhanced_format_text);
    test_standard_csv_format();
    test_enhanced_csv_format();
}
function P($cmd, $o)
{
    echo($cmd ."\n");
    echo(json_encode($o, JSON_UNESCAPED_UNICODE) ."\n\n");
}
function test_standard_csv_format()
{
    global $_tab1;
    P('select ALL to rows', $_tab1->selectAll()->toRows());
    P('select ALL to objs', $_tab1->selectAll()->toObjs());
    P('select first row', $_tab1->selectFirstRow()->toFirstRow());
    P('select first obj', $_tab1->selectFirstRow()->toFirstObj());
    P('select last row', $_tab1->selectLastRow()->toFirstRow());
    P('select last obj', $_tab1->selectLastRow()->toFirstObj());

    P('selectWhenE (id) = "2"', $_tab1->selectWhenE(1, "2")->toFirstObj());
    P('selectWhenE (id) = "3" and (id2) = "21"', $_tab1->selectWhenE2(1, "3", "21")->toFirstObj());
    P('selectWhenE (id) = "4" and (id2) = "21" and (id3) = "200"', $_tab1->selectWhenE3(1, "4", "21", "200")->toFirstObj());
    P('selectWhenE ALL (id2) = "20"', $_tab1->selectWhenE(0, "20", 1)->toObjs());
    P('merge tables', $_tab1->merge($_tab1)->selectAll()->toRows());
}
function test_enhanced_csv_format()
{
    global $_tab2;
    P('[E] select ALL to rows', $_tab2->selectAll()->toRows());
    P('[E] select ALL to objs', $_tab2->selectAll()->toObjs());
    P('[E] select first row', $_tab2->selectFirstRow()->toFirstRow());
    P('[E] select first obj', $_tab2->selectFirstRow()->toFirstObj());
    P('[E] select last row', $_tab2->selectLastRow()->toFirstRow());
    P('[E] select last obj', $_tab2->selectLastRow()->toFirstObj());

    P('[E] selectWhenE (id) = 2', $_tab2->selectWhenE(1, 2)->toFirstObj());
    P('[E] selectWhenE (id) = -1', $_tab2->selectWhenE(1, -1)->toFirstObj());
    P('[E] selectWhenE2 (id) = 3 and (id2) = 22', $_tab2->selectWhenE2(1, 3, 22)->toFirstObj());
    P('[E] selectWhenE2 (id) = 3 and (id2) = -1', $_tab2->selectWhenE2(1, 3, -1)->toFirstObj());
    P('[E] selectWhenE3 (id) = 4 and (id2) = 22 and (id3) = 200', $_tab2->selectWhenE3(1, 4, 22, 200)->toFirstObj());
    P('[E] selectWhenE3 (id) = 4 and (id2) = 22 and (id3) = -1', $_tab2->selectWhenE3(1, 4, 22, -1)->toFirstObj());
    P('[E] selectWhenE ALL (id2) = 21', $_tab2->selectWhenE(0, 21, 1)->toObjs());
    P('[E] selectWhenE ALL (id2) = -1', $_tab2->selectWhenE(0, -1, 1)->toObjs());

    P('[E] selectWhenG ALL (id2) > 25', $_tab2->selectWhenG(0, false, 25, 1)->toObjs());
    P('[E] selectWhenG ALL (id2) >= 25', $_tab2->selectWhenG(0, true, 25, 1)->toObjs());
    P('[E] selectWhenG ALL (id2) > 30', $_tab2->selectWhenG(0, false, 30, 1)->toObjs());
    P('[E] selectWhenL ALL (id2) < 22', $_tab2->selectWhenL(0, false, 22, 1)->toObjs());
    P('[E] selectWhenL ALL (id2) <= 22', $_tab2->selectWhenL(0, true, 22, 1)->toObjs());
    P('[E] selectWhenL ALL (id2) < 20', $_tab2->selectWhenL(0, true, 20, 1)->toObjs());
    P('[E] selectWhenGreaterAndLess ALL (id2) > 21 and (id2) < 24', $_tab2->selectWhenGreaterAndLess(0, false, false, 21, 24, 1)->toObjs());
    P('[E] selectWhenGreaterAndLess ALL (id2) >= 21 and (id2) <= 24', $_tab2->selectWhenGreaterAndLess(0, true, true, 21, 24, 1)->toObjs());
    P('[E] selectWhenLessOrGreater ALL (id2) < 22 or (id2) > 25', $_tab2->selectWhenLessOrGreater(0, false, false, 22, 25, 1)->toObjs());
    P('[E] selectWhenLessOrGreater ALL (id2) <= 22 or (id2) >= 25', $_tab2->selectWhenLessOrGreater(0, true, true, 22, 25, 1)->toObjs());
    P('[E] selectWhenIn (id) in 3,4,5', $_tab2->selectWhenIn(1, [3, 4, 5])->toObjs());
    P('[E] selectAt rows at 0,1,10', $_tab2->selectAt([0, 1, 10])->toObjs());

    P('[E] multi selects (id3) = 100 and (id2) < 22', $_tab2->selectWhenE(0, 100, 2)->selectWhenL(0, false, 22, 1)->toObjs());
    P('[E] sort by (id3) = 300 desc (id)', $_tab2->selectWhenE(0, 300, 2)->sortBy(0, 1)->toObjs());

    $_tab2->createIndexAt(0);
    P("[E] (indexed) 1st row name", $_tab2->selectWhenE(1, 'Dwi', $_tab2->getColIndexBy('name'))->toObjs()[0]['name']);
    P('[E] (indexed) 99th row', $_tab2->selectWhenE(1, 99)->toObjs());
}
main();
