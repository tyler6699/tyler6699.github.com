String processingString = "Hello from Processing!";
string page_users; // REMOVE
ArrayList user_array;
Hero hero;
int gravity = 10;
PImage box_img;
PImage empty_box_img;
int floor_y = 195;
// TRAIL
int num = 10;
float mx[] = new float[num];
float my[] = new float[num];

// Controls
boolean left;
boolean right;

// FFs
int max_users = 7;
float start_x;
float gap;
float padding;

void setup() {
	size(800,250);
	frameRate( 30 );

	hero = new Hero();

	page_users = jsString;
	user_array = new ArrayList();

	String[] user_names = split(jsString, ',');
	int length = user_names.length() > 10 ? 10 : user_names.length();

	gap = 800/length+2;
	padding = (800/length-60)/2;
	println(padding);
	int i = 0;
	for(string s : user_names){
		if (i<=10){
			user_array.add(new User(s, i, (i*gap)+padding));
		}
		i++;
	}
	box_img = loadImage("images/box.png");
	empty_box_img = loadImage("images/empty_box.png");
	get_users()
}

void draw(){
	background( 100 );
	hero.tick();
	fill(#99B2E6);

	// HERO TRAIL
	int which = frameCount % num;
	mx[which] = hero.x+10;
	my[which] = hero.y+5;
	for (int i = 0; i < num; i++) {
		fill(#FFFFFF);
		int index = (which+1 + i) % num;
		ellipse(mx[index], my[index], i, i);
	}

	if (right){
		image(hero.right_img, hero.x, hero.y-5,20,20);
		hero.last_img = hero.right_img;
	} else if(left){
		image(hero.left_img, hero.x, hero.y-5,20,20);
		hero.last_img = hero.left_img;
	} else {
		image(hero.last_img, hero.x, hero.y-5,20,20);
	}

	boolean done = true;
	for(User u : user_array){
		if (!u.hit){
			done = false;
			image(box_img, u.x, u.y);
		} else {
			image(empty_box_img, u.x, u.y);
		}
	}

	if(done){
		fill(0,0,0);
		textSize(30)
		text("Thanks for playing #FF",240,40);
	}

	for (int i = 0; i <= 20; i++){
		image(empty_box_img, 40*i, 210);
	}

}

void get_users(){
	String output = "";
	for(User u : user_array){
		if(u.hit){
			output += "<a class='btn btn-primary' style='margin:5px' href='" +u.url + "'>" + u.name +"</a></br>";
		}
	}
	printMessage(output);
}

class Hero{
	float x;
	float y;
	float w;
	float h;
	PImage left_img;
	PImage right_img;
	PImage last_img;
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
	Rectangle rec;

	public Hero(){
		w = 20;
		h = 20;
		y = floor_y;
		speed = 1;
		min_speed = 1;
		max_speed = 10;
		left_img = loadImage("images/bot_left.png");
		right_img = loadImage("images/bot_right.png");
		last_img = right_img;
		velocity = 0;
		jump = false;
		max_y_velocity = 100;
		min_y_velocity = 25;
		y_velocity = 0;
		rec = new Rectangle(x,y,w,h);
	}

	void tick(){
		if(right){
			velocity = velocity == 0 ? min_speed : velocity += speed;
			velocity = velocity > max_speed ? max_speed : velocity;
		} else if(left){
			velocity = velocity == 0 ? -min_speed : velocity -= speed;
			velocity = velocity < -max_speed ? -max_speed : velocity;
		}

		// MOVE
		hero.x += velocity;

		// SLOW DOWN
		if (!left && !right){
			if(velocity > 0){
				velocity --;
			} else if (velocity < 0){
				velocity ++;
			}
		}

		// DO JUMP
		if(hero.jump){
			hero.y_velocity = 20;
			hero.grounded = false;
			hero.jump = false;
		}

		// MOVE
		hero.y -= hero.y_velocity;

		// LOWER Y VELOCITY
		if(!hero.grounded){
			hero.y_velocity -= 2;
		}

		// HARD CODED FLOOR Y
		if(hero.y > floor_y){
			hero.y = floor_y;
			hero.grounded = true;
		}
		rec.update_hitbox(x,y,w,h);

		for(User u : user_array){
			if(u.rec.colide(hero.rec) && !u.hit){
				u.hit = true;
				get_users();
			}
		}

	}
}

class User{
	int id;
	float x;
	float y;
	string name;
	string url;
	Rectangle rec;
	boolean hit;

	public User(string _name, int _id, _x){
		id = _id
		name = _name;
		url = "https://twitter.com/" + name;
		x = _x;
		y = 60;
		rec = new Rectangle(x,y,40,40);
	}
}

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
