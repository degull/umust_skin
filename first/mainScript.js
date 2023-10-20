const inName = document.getElementById('name');
const inBirthDate = document.getElementById('birthDate');
const inLunar = document.getElementById('lunar');
const inLeapMonth = document.getElementById('leapMonth');
const inBirthTime = document.getElementById('birthTime');
const inNoBirthTime = document.getElementById('noBirthTime');
const inFemale = document.getElementById('female');


// 먼저 입력된 데이터를 체크한다.
function checkInputData() {

    // 이름 텍스트박스 값
    let nameVal = inName.value;
    // 생년월일 텍스트박스 값
    let birthDateVal = inBirthDate.value;
    // 음력 체크박스가 체크되어 있으면 true, 그렇지 않으면 false 반환
    let isLunarChecked = inLunar.checked;
    // 윤달 체크박스가 체크되어 있으면 true, 그렇지 않으면 false 반환
    let isLeapMonthChecked = inLeapMonth.checked;
    // 출생시간 텍스트박스 값
    let birthTimeVal = inBirthTime.value;
    // 출생시간 모름 체크박스가 체크되어 있으면 true, 그렇지 않으면 false 반환
    let noBirthTimeChecked = inNoBirthTime.checked;

    // 이름 입력 데이터가 없다면 에러 메시지를 출력한다
    if (!nameVal) {
        // alert('이름을 입력해주세요.');
        swal('사주 알라', '이름을 입력해주세요.');
        return false;
    }

    // 생년월일 입력 데이터가 없다면 에러 메시지를 출력한다
    if (!birthDateVal) {
        swal('사주 알라', '생년월일을 입력해주세요.');
        return false;
    }

    // 입력한 값이 yyyymmdd 형식의 문자열인지 확인
    if (!/^\d{8}$/.test(birthDateVal)) {
        swal('사주 알라', "생년월일은 YYYYMMDD 형식으로 숫자를 입력해야 합니다.");
        return false;
    }

    // 생년월일은 8자리 유효하지 않은 형식이라면 에러 메시지를 출력한다
    if (birthDateVal.length > 8) {
        swal('사주 알라', '생년월일은 8자리로 입력해야 합니다.');
        return false;
    }

    // 생년월일에서 연도 부분 추출
    let birthYear = parseInt(birthDateVal.slice(0, 4));

    // 연도 유효성 체크
    if (birthYear < 1900 || birthYear > 2100) {
        swal('사주 알라', '생년은 1900년 부터 2100년까지 가능합니다.');
        return false;
    }

    // 생년월일의 다음 2자리가 유효한 월인지 체크
    let birthMonth = parseInt(birthDateVal.substring(4, 6));
    if (birthMonth < 1 || birthMonth > 12) {
        swal('사주 알라', "생월은 1월부터 12월까지 가능합니다.");
        return false;
    }

    // 유효한 생일인지 체크
    const birthDay = parseInt(birthDateVal.slice(6, 8));
    const maxDay = new Date(birthYear, birthMonth, 0).getDate(); // 해당 월의 마지막 일
    if (birthDay < 1 || birthDay > maxDay) {
        swal('사주 알라', '존재하지 않는 생일 날짜입니다.');
        return false;
    }

    // 윤달 체크박스가 체크되어 있는데 음력이 아닌 경우 에러처리
    if (isLeapMonthChecked && !isLunarChecked) {
        swal('사주 알라', '윤달은 음력에만 해당됩니다.');
        return;
    }

    // 출생시간을 아는 경우는
    if (noBirthTimeChecked == false) {

        // 출생시간은 4자리 유효하지 않은 형식이라면 에러 메시지를 출력한다
        if (birthTimeVal.length !== 4) {
            swal('사주 알라', '출생시간은 4자리로 입력해야 합니다.');
            return false;
        }

        // 입력된 값이 4자리 숫자가 아닌 경우 에러 처리
        if (!/^\d{4}$/.test(birthTimeVal)) {
            swal('사주 알라', '출생시간은 4자리 숫자로 입력해주세요.');
            return false;
        }

        const birthHour = parseInt(birthTimeVal.substr(0, 2));

        // 00(자정)에서 23시까지 입력 가능
        if (birthHour < 0 || birthHour > 23) {
            swal('사주 알라', '출생시간은 00(자정)에서 23시까지 입력 가능합니다.');
            return false;
        }
    }

    // 모든 체크가 통과되었다면 true 값을 반환한다
    return true;
}

// 시간 모름 체크되면 공란으로 데이타 처리
inNoBirthTime.addEventListener('change', function() {
    if (inNoBirthTime.checked) {
        inBirthTime.value = '';
    }
});

// 출생시간 입력하면 시간 모름 체크 false 자동변경
inBirthTime.oninput = function() {
    inNoBirthTime.checked = false;
}
// 사주 세우기
async function startMySaju() {
    
    // 생년월일 텍스트박스 값
    let birthDateVal = inBirthDate.value;
    // 음력 체크박스가 체크되어 있으면 true, 그렇지 않으면 false 반환
    let isLunarChecked = inLunar.checked;
    // 윤달 체크박스가 체크되어 있으면 true, 그렇지 않으면 false 반환
    let isLeapMonthChecked = inLeapMonth.checked;
    // 출생시간 텍스트박스 값
    let birthTimeVal = inBirthTime.value;
                
    // 입력값이 유효할 경우 서버에 요청
    if (checkInputData()) {
        try {
            const response = await fetch("http://localhost:3000/GetMySaju", {
            // const response = await fetch("https://", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ 
                    "birthDate": birthDateVal, 
                    "lunar" :isLunarChecked,
                    "leapMonth" : isLeapMonthChecked,
                    "birthTime": birthTimeVal }),
            })
            const sajuData = await response.json();
            const mySaju = JSON.parse(sajuData.mySajuResult);
            // console.log('mySaju.error ' + mySaju.error);
            // console.log(mySaju.error.length);
            if (mySaju.error.length === 0) {
                //이름 항목 추가
                sajuData.name = inName.value;
                //성별 항목 추가
                sajuData.sex = inFemale.checked ? '여자' : '남자';
                // localStorage에 sajuData 저장
                localStorage.setItem('sajuData', JSON.stringify(sajuData));
                // 결과 페이지로 이동
                // window.location.href = 'https://';
            } else {
                swal('사주 알라', mySaju.error);
            }
        } catch (error) {
            // console.error('Error fetching data:', error);
            swal('사주 알라', '오류가 발생하였습니다. 이메일 또는 블로그에 알려주세요 :' + error)
        } finally {
            //
        }
    }
}