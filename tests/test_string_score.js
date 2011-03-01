$(document).ready(function(){
  module('String.score');
  
  test('Exact match', function(){
    expect(1);
    equals('Hello World'.score('Hello World'), 1.0, 'Exact matches should score 1.0');
  });
  
  test('Not matchhing', function(){
    expect(2);
    equals("hello world".score("hellx"), 0, 'non-existint charactor in match should return 0');
    equals("hello world".score("hello_world"),0, 'non-existint charactor in match should return 0');
  });
  
  test('Match must be sequential', function(){
    equals('Hello World'.score('WH'), 0, 'Matches out of order should return 0');
  });
  
  test('Same case should match better then wrong case', function(){
    ok('Hello World'.score('hello')<'Hello World'.score('Hello'));
  });
  
  test('Higher score for closer matches', function(){
    ok('Hello World'.score('H')<'Hello World'.score('He'), '"He" should match "Hello World" better then "H" does');
  });
  
  test('Matching with wrong case', function(){
    ok("Hillsdale Michigan".score("himi")>0, 'should match first matchable letter regardless of case');
  });
  
  module('Advanced Scoreing Methods');
  test('consecutive letter bonus', function(){
    expect(1);
    ok('Hello World'.score('Hel') > 'Hello World'.score('Hld'), '"Hel" should match "Hello World" better then "Hld"');
  });
  
  test('Acronym bonus', function(){
    expect(5);
    ok('Hello World'.score('HW') > 'Hello World'.score('Ho'), '"HW" should score higher with "Hello World" then Ho');
    ok('yet another Hello World'.score('yaHW') > 'Hello World'.score('yet another'));
    ok("Hillsdale Michigan".score("HiMi") > "Hillsdale Michigan".score("Hil"), '"HiMi" should match "Hillsdale Michigan" higher then "Hil"');
    ok("Hillsdale Michigan".score("HiMi") > "Hillsdale Michigan".score("illsda"));
    ok("Hillsdale Michigan".score("HiMi") < "Hillsdale Michigan".score("hills")); // but not higher then matching start of word
  });
  
  test('Beginning of string bonus', function(){
    expect(1);
    ok("Hillsdale".score("hi") > "Chippewa".score("hi"));
  });
  
  test('proper string weights', function(){
    ok("Research Resources North".score('res') > "Mary Conces".score('res'), 'res matches "Mary Conces" better then "Research Resources North"');
    
    ok("Research Resources North".score('res') > "Bonnie Strathern - Southwest Michigan Title Search".score('res'));
  });
  
  test('Start of String bonus', function(){
    ok("Mary Large".score('mar') > "Large Mary".score('mar'));
    ok("Silly Mary Large".score('mar') === "Silly Large Mary".score('mar')); // ensure start of string bonus only on start of string
  });
  
  module('Fuzzy String');
  test('should pass with mismatch when fuzzy', function(){
    expect(6);
    equal('Hello World'.score('Hz'), 0, 'should score 0 without a specified fuzzyness.');
    ok('Hello World'.score('Hz', 0.5) > 0, 'should have a score');
    ok('Hello World'.score('Hz', 0.5) < 'Hello World'.score('H', 0.5), 'fuzzy matches should be worse then good ones');
    ok('Hello World'.score('Hz', 0.9) < 'Hello World'.score('H', 0.5), 'higher fuzzyness should yield higher scores');
    ok('Hello World'.score('Hello-World', 0.5) > 'Hello World'.score('HW', 0.5), 'a fuzzy near full match should be higher then a low match');
    equal('Hello World'.score('Hello Wo-ld', 0.5), 'Hello World'.score('He*lo World', 0.5), "a fuzzy near full match shouldn't care where the mismatch is");
  });  
  
  module('Benchmark');
      test('Expand to see time to score', function(){
        var iterations = 4000;
      
        var start1 = new Date().valueOf();
        for(i=iterations;i>0;i--){ "hello world".score("h"); }
        var end1 = new Date().valueOf();
        var t1=end1-start1;
        ok(true, t1 + ' miliseconds to do '+iterations+' iterations of "hello world".score("h")');
        
        var start2 = new Date().valueOf();
        for(i=iterations;i>0;i--){ "hello world".score("hw"); }
        var end2 = new Date().valueOf();
        var t2=end2-start2;
        ok(true, t2 + ' miliseconds to do '+iterations+' iterations of "hello world".score("hw")');
      
        var start3 = new Date().valueOf();
        for(i=iterations;i>0;i--){ "hello world".score("hello world"); }
        var end3 = new Date().valueOf();
        var t3=end3-start3;
        ok(true, t3 + ' miliseconds to do '+iterations+' iterations of "hello world".score("hello world")');
        
        var start4 = new Date().valueOf();
        for(i=iterations;i>0;i--){ "hello any world that will listen".score("hlo wrdthlstn"); }
        var end4 = new Date().valueOf();
        var t4=end4-start4;
        ok(true, t4 + ' miliseconds to do '+iterations+' iterations of "hello any world that will listen".score("hlo wrdthlstn")');
      
        var start5 = new Date().valueOf();
        for(i=iterations;i>0;i--){ "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".score("Lorem i dor coecadipg et, Duis aute irure dole nulla. qui ofa mot am l"); }
        var end5 = new Date().valueOf();
        var t5=end5-start5;
        ok(true, t5 + ' miliseconds to do '+iterations+' iterations of 446 character string scoring a 70 character match');
        
        ok(true, 'score (smaller is faster): '+ (t1+t2+t3+t4+t5)/5);
      });
});