<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Отправка форм AJAX</title>
</head>
<body>
	<form id="form" method="post">
		<input type="text" name="name" placeholder="Ваше имя" required /><br />
		<input type="text" name="phone" placeholder="Ваш телефон" required /><br />
		<button>Отправить</button>
		<?php
		echo 'Hello Wirld';
		?>
	</form>
	<script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
	<script src="common.js"></script>
</body>
</html>