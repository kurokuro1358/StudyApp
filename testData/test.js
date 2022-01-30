$(function(){
    // 表示するテストのための配列
    var numbers = [];

    // タイマー変数
    var count;

    // テスト結果オブジェクト
    var result = [];

    // nowNum: 現在表示している単語の配列番号, nowType: 現在表示しているのがwordかmeaningか
    var nowNum = 0, nowType = undefined;

    // プログレスバーの横幅
    var width = 0;

    // 配列をシャッフルする
    const shuffle = ([...array]) => {
        for (var i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // result配列の初期化
    const setResult = (num) => {
        for(var i=0; i<num; i++){
            var tmp = {answer: undefined, time: 0};
            result.push(tmp);
        }
    };

    // タイマー
    var timer = () => {
        count = setInterval(function(){
            result[nowNum].time = result[nowNum].time + 0.1;
            $('#nowTime').show().text(result[nowNum].time.toFixed(1) + "秒");
        }, 100);
    };

    //　スコアを計算
    const score = () => {
        var sumScore = 0, sumTime = 0;
        for(var i=0; i<result.length; i++){
            if(result[i].answer) sumScore += 1;
            sumTime += result[i].time;
        }
        const total = sumScore * 100 / result.length;
        const aveTime = sumTime / result.length;
        return '正答率：' + total.toFixed(1) + '% &emsp; 平均タイム：' + aveTime.toFixed(1) + '秒';
    }

    // 範囲を作成
    $('#makeRange').on('click', function(){
        // 範囲を取得
        const range1 = parseInt($('#range1').val(), 10);
        const range2 = parseInt($('#range2').val(), 10);

        // 範囲を生成
        var str = "";
        for(var i=range1; i<=range2; i++){
            if(i < range2) str += String(i) + ",";
            else str += String(i);
        }

        // 範囲をセット
        $('#number').text(str);
    });

    // 入力値を取得して、numbers配列を生成
    $('#makeTest').on('click', function(){
        // console.log(reg.test($('#number').val()));
        // テキストボックスの値を取得、カンマ区切りで分割し、配列にする
        const nums = $('#number').val().split(',');

        // int型にキャストして、numbers配列に代入
        numbers = nums.map(num => parseInt(num, 10));
        numbers = shuffle(numbers);

        // テストの問題数をセット
        var quantity = $('#quantity').val();
        if(quantity == ""){
            // 特に何もしない
        } else {
            quantity = parseInt(quantity, 10);
            numbers = numbers.splice(numbers.length - quantity, quantity);
        }
        
        // 問題番号を１にセット・表示
        nowNum = 0;
        nowType = undefined;
        $('#output-test').text(data[numbers[0]-1].word);

        // テストの数を表示
        width = String((nowNum+1) * 100 / numbers.length) + "%";
        $('#progress-bar').text(nowNum+1 + "/" + numbers.length);
        $('#progress-bar').css('width', width);

        // result配列の初期化
        result.length = 0;
        setResult(numbers.length);

        // スタートボタンを表示、それ以外は非表示
        $('#output-test, .progress, #correctButton, #falseButton').hide();
        $('#startButton').show();
        $('#result').hide();

        //折り畳みを閉じる
        $('.collapse').collapse('hide');
    });

    // スタートボタンが押された時の処理
    $('#startButton').on('click', function(){
        $("#output-test, .progress").show();
        $("#startButton").hide();
        timer();
        // プログレスバーを表示
        $('.progress').show();
        // タイプを単語にセット
        nowType = "word";
    });

    // 正解ボタンが押された時の処理
    $('#correctButton').on('click', function(){
        result[nowNum].answer = true;
        stepTest();
    });

    // 間違いボタンが押された時の処理
    $('#falseButton').on('click', function(){
        result[nowNum].answer = false;
        stepTest();
    });

    $(document).on('click', function(e){
        if(nowType === "word") stepTest();
    });

    function stepTest(){
        if(nowType === "word"){ // 現在表示しているのが単語だったら => 意味を表示
            // タイマーをストップ
            clearInterval(count);
            // 意味を表示
            $('#output-test').text(data[numbers[nowNum]-1].meaning);
            // 正解・不正解ボタンを表示
            $('#correctButton, #falseButton').show();
            // 表示を意味にセット
            nowType = "meaning";
            // プログレスバーの長さをセット
            width = String((nowNum+1) * 100 / numbers.length) + "%";
            $('#progress-bar').text(nowNum+1 + "/" + numbers.length);
            $('#progress-bar').css('width', width);
        } else { // 現在表示しているのが意味だったら => 単語を表示
            if(numbers.length-1 > nowNum){
                // 現在番号を進める
                nowNum++;
                // タイマーをスタート
                timer();
                // 単語を表示
                $('#output-test').text(data[numbers[nowNum]-1].word);
                // 正解・不正解ボタンを非表示
                $('#correctButton, #falseButton').hide();
                // 表示を単語にセット
                nowType = "word";
                // プログレスバーの長さをセット
                width = String((nowNum+1) * 100 / numbers.length) + "%";
                $('#progress-bar').text(nowNum+1 + "/" + numbers.length);
                $('#progress-bar').css('width', width);
            } else {
                // 問題を非表示
                $('#output-test, #correctButton, #falseButton').hide();
                // 秒数を非表示
                $('#nowTime').hide();
                // 結果全体を表示
                $('#result').show();
                // スコアを表示
                $('#result #score').empty().append(score());
                // 詳細結果を表示
                $('#result table').empty().append('<tr><th></th><th>問題</th><th>意味</th><th>結果</th><th>タイム</th></tr>');
                for(var i=0; i<result.length; i++){
                    var id = '<td>' + numbers[i] + '</td>'
                    var word = '<td>' + data[numbers[i]-1].word + '</td>';
                    var meaning = '<td>' + data[numbers[i]-1].meaning + '</td>';
                    var answer;
                    if(result[i].answer === true) answer = '<td>正解</td>';
                    if(result[i].answer === false) answer = '<td class="text-danger">不正解</td>';
                    var time = '<td>' + result[i].time.toFixed(1) + '秒</td>';
                    $('#result table').append('<tr>' + id + word + meaning + answer + time + '</tr>')
                }
                // プログレスバーを非表示
                $('.progress').hide();
                // タイプを初期化
                nowType = undefined;
            }
        }
    };
});
