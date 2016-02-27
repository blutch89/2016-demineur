$(function() {
	var minesweeper = Object.create(Minesweeper);
	
	$("#play").on("click", play);
	$("#apply-difficult").on("click", play);
	play();
	
	
	function play() {
		var width = parseInt($("#mines-width").val());
		var height = parseInt($("#mines-height").val());
		var nbMines = parseInt($("#nb-mines").val());
		
		var difficultParam = Object.create(DifficultParam);
		difficultParam.init(width, height, nbMines);
		
		minesweeper.resetGame();
		minesweeper.initGame(difficultParam);
	}
});