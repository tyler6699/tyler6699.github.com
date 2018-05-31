// Global variables
float version = 1.0;
int screen_h;
int screen_w;

Hero hero;
int gravity = 10;
int lower_gravity = 4;
int current_gravity = gravity;
boolean show_debug = false;
boolean game_complete = false;
float timer;
string timer_str;
boolean pause;

// *************
// Levels
Level level;
int current_level = 1;
boolean edit_mode = false;
// *************
x_off = 50;
y_off = 50;

// Controls
boolean left;
boolean right;

// colours :: Add bug versions
color dirt_color = color(#691F01);
color grass_color = color(#4d7455);
color fall_color  = color (#B36666);
color portal_color  = color (#690069);
color bug_fix_color = color(#F87531);
color metal_color = color(#333333);

// CLICKER
float mouse_x;
float mouse_y;
boolean click_processed;
PVector clicked_at;
String tile_info;
Tile clicked_tile;
float spin = 0.0;

// TRAIL
int num = 10;
float mx[] = new float[num];
float my[] = new float[num];

void setup(){
	screen_h = 600;
	screen_w = 800;
	size( screen_w, screen_h);
	
	level = new Level(x_off,y_off);
	if(!edit_mode)get_level(current_level);

	hero = new Hero();
	hero.x = level.start_x;
	hero.y = level.start_y;

	frameRate( 30 );
	pause = true;
	current_level = 1;
	game_complete = false;
	get_level(1);
	timer = 0;
	//noStroke();
}

void draw(){	
	// timer
	if (!game_complete){
		if(!pause){
			timer += 0.033;	
		} else {

		}
	}
	
	// HERO LOGIC
	hero.tick();
		
	// RENDERING
	background( 100 );
    	
	// SPIKEYS
	for(Star star: level.stars){
		fill(#8c8c8c);
		pushMatrix();
		translate(star.x,star.y);
		rotate(frameCount / star.spin_speed);
		star.update(); 
		popMatrix();
		// rect(star.box_x, star.box_y, star.box_w, star.box_h);		
	}
	
	// Tiles	
	for(Tile t: level.tiles){
		if (t.active){
			if(t.type == 3){
				if(!edit_mode){
					t.tick();
				}	
			}
			
			fill(t.color);
			if(t.type == 2 || t.type == 3){
				rect(t.x, t.y, t.w, t.h);
			} else {
				rect(t.x, t.y, t.w, t.h);
			}
		} else {
			fill(t.color);
			if(edit_mode)rect(t.x, t.y, t.w, t.h);	
		}		
	}
	
	// PORTAL
	if(level.portal != null){
		fill(level.portal.color);
		rect(level.portal.x, level.portal.y, level.portal.w, level.portal.h);	
	}
	
	// BUG
	if(level.bug_fix != null){
		fill(level.bug_fix.color);
		rect(level.bug_fix.x, level.bug_fix.y, level.bug_fix.w, level.bug_fix.h);	
	}
	 	
	// HERO TRAIL
	int which = frameCount % num;
	mx[which] = hero.x+10;
	my[which] = hero.y+10;
	for (int i = 0; i < num; i++) {
		fill(#bd1f30);
		int index = (which+1 + i) % num;
		ellipse(mx[index], my[index], i, i);
	}
	
	// HERO
	hero.draw();
	fill(0);
	text("Bugs Fixed: " + hero.bugs_fixed,20,20); 
	timer_str = nf(timer, 4,2);
	text("Time: " + timer_str, 20, 40);
	text("Deaths: " + hero.deaths, 20, 60);
	text("Level Bug Fixed: " + level.bug_fixed,20,80);
	text("Level: " + current_level,20,100);
	if(pause){
		text("======================== PAUSED (Press P) ========================", 100, 250);
	}
	if (game_complete){
		text("Bugs Fixed: " + hero.bugs_fixed + "/ 15",310,340); 
		timer_str = nf(timer, 4,2);
		text("Time: " + timer_str, 310, 360);
		text("Deaths: " + hero.deaths, 310, 380);
		text("Version: " + version, 310, 400);
	}
	
	if(clicked_at != null){
	//text("CLICKED: " + click_processed + " at: x: " + clicked_at.x + " y: " + clicked_at.y,20,65);
	}
	if(show_debug || edit_mode){
		// Text
		text("Hero x: " + hero.x + " hero.y: " + hero.y  ,20,20); 
		text("BUG: " + level.bug_fixed, 20, 35);
		text("Velocity: " + hero.velocity,20,50); 
		if(clicked_at != null){
			text("CLICKED: " + click_processed + " at: x: " + clicked_at.x + " y: " + clicked_at.y,20,65);
		}
		text("Time: " + millis()/1000, 20, 80);
	}
}

private void move(float x_move, float y_move){	
	if(!pause){
		// LEFT & RIGHT
		if(x_move > 0){
			for (int i=0; i <= x_move; i++){
				if (move_bit(level.tiles, 1, y_move)){
					hero.x += 1;
				}
			}	
		} else if(x_move < 0) {
			for (int i=x_move; i <= 0; i++){
				if (move_bit(level.tiles, -1, y_move)){
					hero.x -= 1;
				}
			}	
		}
			
		// JUMP
		if(hero.jump){
			if (hero.grounded) hero.y_velocity = hero.min_y_velocity; // NORMAL JUMP
			if (hero.against_wall){
				hero.y_velocity = hero.min_y_velocity;
				if(hero.wall_left){
					hero.velocity = hero.min_speed*4;	
				} else if(hero.wall_right){
					hero.velocity = -hero.min_speed*4;	
				}
				
			}
		}
		
		// DO JUMP
		for (int i=0; i <= hero.y_velocity; i++){
			if(move_bit(level.tiles,0,-1)){
				hero.y -= 1;
			} else {
				break;
			}	
		}
			
		// Gravity
		hero.grounded = false;
		current_gravity = hero.against_wall ? gravity - lower_gravity : gravity;
		for (int i=0; i <= current_gravity; i++){
			if(move_bit(level.tiles,0,1)){
				hero.y += 1;
			} else {
				hero.grounded = true;
				break;
			}	
		}
		
		// Apply custom gravity to Y Velocity
		if(!hero.grounded){ 
			hero.y_velocity -= 2;
		} else {
			hero.y_velocity = 0;
		}
			
		// Off Screen	
		if(hero.y > screen_h){
			hero.reset();
		}
		
		// Check if hero is wall sliding
		hero.wall_left = move_bit(level.tiles,-1,0) == false;
		hero.wall_right = move_bit(level.tiles,1,0) == false;
		hero.against_wall = ( hero.wall_left || hero.wall_right );
			
		// SET TILES BELOW, RIGHT, LEFT	
		hero.tile_below = get_tile(hero.x+10,hero.y+hero.h+10, false);
		hero.tile_right = get_tile(hero.x+23,hero.y+10, false);
		hero.tile_left = get_tile(hero.x-5,hero.y+10, false);
		
		// TICK VOLATILES	
		if (hero.tile_below != null){
			if(hero.tile_below.type == 3){
				hero.tile_below.vola_tick();
			}	
		}
		if (hero.tile_right != null){
			if(hero.tile_right.type == 3){
				hero.tile_right.vola_tick();
			}	
		}
		if (hero.tile_left != null){
			if(hero.tile_left.type == 3){
				hero.tile_left.vola_tick();
			}	
		}
	}
}

class Hero{
	float x;
	float y;
	float w;
	float h;
	PImage idle_img; 
	float speed;
	float velocity;
	float y_velocity;
	float max_y_velocity;
	float min_y_velocity;
	float min_speed;
	float max_speed;
	boolean moving;
	boolean jump;
	boolean grounded;
	boolean against_wall;
	boolean wall_right;
	boolean wall_left;
	float ticks_against_wall;
	float ticks_off_wall;
	Rectangle rec;
	Tile tile_below;
	Tile tile_right;
	Tile tile_left;
	int bugs_fixed;
	int deaths;
	
	public Hero(){
		w = 20;
		h = 20;
		speed = 1;
		min_speed = 1;
		max_speed = 10;
		idle_img = loadImage("images/meatly_idle"); 
		velocity = 0;
		jump = false;
		max_y_velocity = 100;
		min_y_velocity = 25;
		y_velocity = 0;
		rec = new Rectangle(x,y,w,h); 
	}
	
	public void draw(){
		// rect(hero.x, hero.y, hero.w, hero.h);
		image(hero.idle_img, hero.x, hero.y-5);
	}
	
	public void reset(){
		deaths ++;
		x = level.start_x;
		y = level.start_y;
		// Reset Falling tiles
		for (Tile t: level.tiles){
			if(t.type == 3){
				t.y = t.original_y;
				t.vola_tile_tick = 0;
				t.active = true;
				t.set_hitbox();
			}
		}		
		if(level.bug_fix != null){
			if(level.bug_fixed){
				hero.bugs_fixed --;
			}
			level.bug_fix.active = true;
			level.bug_fixed = false;	
		}
	}
	
	public void win(){
		if (current_level == 15){
			game_complete = true;
			get_level(16);
		} else {
			current_level ++;
			get_level(current_level);
			x = level.start_x;
			y = level.start_y;
		}
		
	}
	
	public void tick(){
		rec.update_hitbox(x,y,w,h);
		
		// PORTAL
		if(level.portal != null){
			if(rec.colide(level.portal.rec)){
				win();
			}
		}
		
		// BUG FIX
		if(level.bug_fix != null && level.bug_fix.active){
			if(rec.colide(level.bug_fix.rec)){
				level.bug_fix.active = false;
				level.bug_fixed = true;
				hero.bugs_fixed ++;
				// println("Fixing a bug!");
			}
		}
		
		// BLADES
		for(Star star: level.stars){
			if(rec.colide(star.rec)){
				reset();
			}
		}
		
		if(against_wall){
			if(ticks_against_wall < 20)ticks_against_wall++;
			ticks_off_wall = 0;
		} else {
			if(ticks_off_wall < 20)ticks_off_wall++;
			ticks_against_wall = 0;
		}
		
		if(right){
			if(velocity == 0){
				velocity = min_speed;
			} else if(velocity < max_speed) {
				velocity += speed;	
			}		
		} else if(left){
			if(velocity == 0){
				velocity = -min_speed;
			} else if(velocity > -max_speed){
				velocity -= speed;	
			}
		}
		// DO MOVEMENT WITH CHECKS
		move(velocity, 0);	
	
		if (!left && !right){
			if(velocity > 0){
				if(hero.grounded){
					velocity = velocity - 2 < 0 ? 0 : velocity - 2;	
				} else {
					velocity --;	
				}
				
			} else if (velocity < 0){
				if(hero.grounded){
					velocity = velocity + 2 > 0 ? 0 : velocity + 2;	
				} else {
					velocity ++;	
				}
			}	
		}
	}
}

class Tile{
	int no;
	int type;
	int w;
	int h;
	int row;
	int col;
	float x;
	float y;
	float original_y;
	float x2;
	float y2;
	boolean active;
	boolean vola_tile;
	boolean portal;
	boolean bug;
	float vola_tile_tick;
	float vola_tile_max_tick = 2;
	Rectangle rec;
	PImage texture;
	Star star;
	color color;
	
	public Tile(int _col, int _row, float _x, float _y, float width, float height, int id, int max_row, int max_col){
		row = _row;
		col = _col;
		no = id;
		x = _x;
		y = _y;
		original_y = y;
		w = width;
		h = height;
		rec = new Rectangle(x,y,w,h);
		set_type();
	}

	public Tile(float _x, float _y, int _type){
		x = _x;
		y = _y;
		original_y = y;
		w = 20;
		h = 20;
		type = _type;
		rec = new Rectangle(x,y,w,h);
		active = true;
		set_type();
		no = 0;
	}
	
	public Tile(float _x, float _y, int _type, int _id){
		x = _x;
		y = _y;
		original_y = y;
		w = 20;
		h = 20;
		type = _type;
		rec = new Rectangle(x,y,w,h);
		active = true;
		set_type();
		no = _id;
	}
	
	public void tick(){
		if(vola_tile_tick > vola_tile_max_tick ){
			y += 5;
			set_hitbox();
		}
	}
	
	public void vola_tick(){
		if(y < screen_h){
			vola_tile_tick ++;	
		} else {
			active = false;			
		}
	}
	
	public void change(){
		// TYPE
		// 0 : NOTHING
		// 1 : DIRT
		// 2 : GRASS
		// 3 : Volatile
		// 4 : Portal
		// 5 : BUG FIX   
		// 6 : METAL
		
		type = type + 1 > 6 ? 0 : type + 1;
		if(type == 4){
			type = 6;
		}
		set_type();
	}
	
	void set_type(){
		switch(type) {
		case 0: // NOTHING
			active = false;
			color = #000000;
			break;
		case 1: // DIRT
			active = true;
			color = dirt_color;
			break;
		case 2: // GRASS
			color = grass_color;
			active = true;
			break;
		case 3: // VOLATILE
			color = fall_color;
			active = true;
			vola_tile = true;
			vola_tile_tick = 0;
			break;
		case 4: // PORTAL
			color = portal_color;
			portal = true;
			active = true;
			break;
		case 5: // BUG FIX
			color = bug_fix_color;
			bug = true;
			active = true;
			break;
		case 6: // METAL
			color = metal_color;
			active = true;
			break;
		}
	}
	
	void set_hitbox(){
		x2 = x + w;
		y2 = y +h;
		rec = new Rectangle(x,y,w,h);
	}
}

class Level{
	int id;
	int start_x;
	int start_y;
	Tile portal;
	Tile bug_fix;
	float rows;
	float cols;
	ArrayList tiles;
	ArrayList stars;
	int flip_y;
	boolean bug_fixed;
	
	public Level(float x_offset, float y_offset){
		bugs_fixed = false;
		tiles = new ArrayList();
		stars = new ArrayList();
	
		rows = 25;
		cols = 30;
		int id = 0;
		
		if(edit_mode){
			for(int r = 0; r < rows; r++){
				for(int c = 0; c < cols; c++){
					flip_y = (screen_h-(r*20))-y_off;
					tiles.add( new Tile(c,r,c*20+x_offset, flip_y, 20, 20, id, rows, cols));
					id ++;
				}	
			}	
		}		
	}
}

// INPUT
void keyPressed() {
    if(key == 'D' || key == 'd' || keyCode == 39) {
		right = true;
    }
	
	if(key == 'A' || key == 'a' || keyCode == 37) {
		left = true;
    }
	
	if(key == 32){
		hero.jump = true;
	}
	

	if(key == 'r' || key == 'R'){
		setup();
	}
	
	if(key == 'p' || key == 'P'){
		pause = !pause;
		//int count = 0;
		//string level_str = "";
		//for(Tile t : level.tiles){
			//if(t.active){
				//level_str += t.x + ":" + t.y + ":" + t.type + ":" + t.no + "," ;		
			
				// Split into 10 tiles per line
				//if(count >= 9){
				//	println("tiles_str += '" + level_str + "'");
				//	level_str = "";	
				//	count = 0;
				//} else {
				//	count ++;
				//}				
			//}
		//}
		//if(count < 10){
		//	println("tiles_str += '" + level_str + "'");
		//}		
	}
  }
  
void keyReleased() {
	 if(key == 'D' || key == 'd' || keyCode == 39) {
		right = false;
    }
	
	if(key == 'A' || key == 'a' || keyCode == 37) {
		left = false;
    }
	
	if(key == 32){
		hero.jump = false;
	}
}

void mouseMoved(){
  mouse_x = mouseX;
  mouse_y = mouseY;  
}

void mousePressed() {
	click_processed = false;
	clicked_at = new PVector(mouse_x, mouse_y);
	if(edit_mode){
		clicked_tile = get_tile(clicked_at.x, clicked_at.y, true);	
	}
}

public void get_tile(float x, float y, boolean change){
	Tile tile;
	x = x - x_off;
		
	int flip_y = (screen_h-y)-(y_off-20);
	int tile_col = (int)((x)/20);
	int tile_row = (int) (flip_y/20) % level.rows;
	int tile_no;
	tile_no = (tile_row * level.cols) + tile_col;
	
	// println("COL: " + tile_col + " ROW: " + tile_row + " ID: " + tile_no);
		
	for(Tile t: level.tiles){
		if (t.no == tile_no){
			tile = t;
			break;				
		}		
	}
		
	if (tile != null && change){
		tile.change(); 
	}
		
	return tile;
}

// MOVEMENT
public boolean move_bit(ArrayList<Tile> tiles, float x_move, float y_move){
	return test_move(tiles, hero.x, hero.y, x_move, y_move);
}
	
private boolean test_move(ArrayList<Tile> tiles, float current_x, float current_y, float x_move, float y_move){
	boolean move = true;
	Rectangle rec = new Rectangle(current_x+x_move,current_y+y_move, hero.w, hero.h); 
		
	for(Tile t: tiles){
		if (t.active){
			if(t.rec.colide(rec)){			
				move = false;
				break;
			}
		}
	}				
	return move;
}

// Items
class Rectangle{
	float w;
	float h;
	float x1;
	float x2;
	float y1;
	float y2;
	
	public Rectangle(float _x1, float _y1, float _w, float _h){
		update_hitbox(_x1, _y1, _w, _h);
	}
	
	void update_hitbox(float _x1, float _y1, float _w, float _h){
		w = _w;
		h = _h;
		x1 = _x1;
		x2 = _x1 + w;
		y1 = _y1;
		y2 = _y1 + h;
	}
	
	boolean colide(Rectangle rec){
		return x1 < rec.x2 && x2 > rec.x1 && y1 < rec.y2 && y2 > rec.y1
	}
}

class Star{
	float x; 
	float y;
	float original_y;
	float original_x;
	float x_off;
	float y_off;
	float inner_radius;
	float outer_radius;
	int spikes;
	int spin_speed;
	int box_x;
	int box_y;
	int box_w;
	int box_h;
	Rectangle rec;
	int move_x;
	int moved_x;
	int move_y;
	int moved_y;
	int move_speed;
	boolean move_right;
	boolean move_up;
	
	public Star(float _x, float _y, float _x_off, float _y_off, float _inner_radius, float _outer_radius, int _spikes, int _spin_speed){
		x = _x; 
		y = _y;
		original_x = x;
		original_y = y;
		x_off = _x_off; 
		y_off = _y_off;
		inner_radius = _inner_radius;
		outer_radius = _outer_radius;
		spikes = _spikes;
		spin_speed = _spin_speed;
		box_x = x-inner_radius+5;
		box_y = y-inner_radius+5;
		box_w = (inner_radius*2)-10;
		box_h = (inner_radius*2)-10;
		rec = new Rectangle(box_x, box_y, box_w, box_h);		
	}
	
	void update() {
		if (move_x != 0){
			if (move_right){
				x+= move_speed;
				moved_x += move_speed;
			} else {
				x -= move_speed;
				moved_x += move_speed;
			}
			if (moved_x > move_x){
				move_right = !move_right;
				moved_x = 0;
			}
			update_hitbox();
		} else if(move_y != 0){
			if (move_up){
				y+= move_speed;
				moved_y += move_speed;
			} else {
				y -= move_speed;
				moved_y += move_speed;
			}
			if (moved_y > move_y){
				move_up = !move_up;
				moved_y = 0;
			}
			update_hitbox();
		}
		
		float angle = TWO_PI / spikes;
		float halfAngle = angle/2.0;
		beginShape();
		for (float a = 0; a < TWO_PI; a += angle) {
			float sx = x_off + cos(a) * outer_radius;
			float sy = y_off + sin(a) * outer_radius;
			vertex(sx, sy);
			sx = x_off + cos(a+halfAngle) * inner_radius;
			sy = y_off + sin(a+halfAngle) * inner_radius;
			vertex(sx, sy);
		}
		endShape(CLOSE);
		box_x = x-inner_radius+5;
		box_y = y-inner_radius+5;
		box_w = (inner_radius*2)-10;
		box_h = (inner_radius*2)-10;
		rec = new Rectangle(box_x, box_y, box_w, box_h);
	}
	
	void update_hitbox(){
		// UPDATE HITBOX
		box_x = x-inner_radius+5;
		box_y = y-inner_radius+5;
		rec = new Rectangle(box_x, box_y, box_w, box_h);
	}
}
