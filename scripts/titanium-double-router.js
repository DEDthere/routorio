var alive = {};

const titaniumDoubleRouter = extendContent(Router, "titanium-double-router", {
	draw(tile) {
		Draw.rect(Core.atlas.find(this.name + "_" + tile.x % 2),
			tile.drawx(),
			tile.drawy());
	},

	generateIcons() {
		return [Core.atlas.find(this.name)];
	},

	calcOffset(tile) {
		var x = tile.x;
		if (x % 2 == 0) {
			x++;
		} else {
			x--;
		}
		return x;
	},

	canPlaceOn(tile){
		const x = this.calcOffset(tile);
		const other = Vars.world.tile(x, tile.y);
		return other.block() == "air"
	},

	placed(tile) {
		this.super$placed(tile);
		const x = this.calcOffset(tile);
		Call.setTile(Vars.world.tile(x, tile.y), this, tile.team, 0);
		alive[x + "," + tile.y] = true;
		alive[tile.x + "," + tile.y] = true;
	},

	removed(tile) {
		this.super$removed(tile);
		const x = this.calcOffset(tile);
		const key = tile.x + "," + tile.y;
		/* Prevent trying to delete the other half infinitely */
		if (alive[key]) {
			alive[key] = false;
			Call.setTile(Vars.world.tile(x, tile.y), Blocks.air, tile.team, 0);
		}
	},
	chad: false
});
