### HTML 코드

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>섬 사진 사이드바</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="sidebar">
        <h2>섬 사진 갤러리</h2>
        <div class="image-container">
            <img src="island1.jpg" alt="섬 사진 1">
            <p>섬 사진 1 설명</p>
        </div>
        <div class="image-container">
            <img src="island2.jpg" alt="섬 사진 2">
            <p>섬 사진 2 설명</p>
        </div>
        <div class="image-container">
            <img src="island3.jpg" alt="섬 사진 3">
            <p>섬 사진 3 설명</p>
        </div>
        <!-- 추가 섬 사진을 여기에 넣을 수 있습니다 -->
    </div>
</body>
</html>
```

### CSS 코드 (styles.css)

```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

.sidebar {
    width: 300px;
    background-color: #fff;
    border-right: 2px solid #ddd;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    position: fixed;
    height: 100%;
}

.sidebar h2 {
    text-align: center;
    color: #333;
}

.image-container {
    margin: 15px 0;
    text-align: center;
}

.image-container img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    transition: transform 0.2s;
}

.image-container img:hover {
    transform: scale(1.05);
}

.image-container p {
    margin-top: 5px;
    color: #666;
}
```

### 설명
1. **HTML 구조**: 사이드바는 `div.sidebar`로 감싸져 있으며, 각 섬 사진은 `div.image-container`로 묶여 있습니다. 각 사진 아래에는 설명을 추가할 수 있습니다.

2. **CSS 스타일**:
   - 사이드바의 배경색, 테두리, 그림자 등을 설정하여 시각적으로 구분되도록 했습니다.
   - 사진은 반응형으로 설정되어 있으며, 마우스를 올리면 약간 확대되는 효과를 주었습니다.
   - 텍스트 색상과 정렬을 조정하여 가독성을 높였습니다.

이 코드를 사용하여 사이드바에 섬 사진을 추가하고, 원하는 대로 스타일을 조정할 수 있습니다. 추가적인 섬 사진을 넣고 싶다면, `image-container`를 복사하여 추가하면 됩니다.