% Black Rook  . Black kNight  . Black Bishop  . Black Queen   . Black King    . Black Bishop  . Black kNight  . Black Rook    .
% Black Pawn  . Black Pawn    . Black Pawn    . Black Pawn    . Black Pawn    . Black Pawn    . Black Pawn    . Black Pawn    .
cell(1, 8, br). cell(2, 8, bn). cell(3, 8, bb). cell(4, 8, bq). cell(5, 8, bk). cell(6, 8, bb). cell(7, 8, bn). cell(8, 8, br). % 8
cell(1, 7, bp). cell(2, 7, bp). cell(3, 7, bp). cell(4, 7, bp). cell(5, 7, bp). cell(6, 7, bp). cell(7, 7, bp). cell(8, 7, bp). % 7
cell(1, 6, e) . cell(2, 6, e) . cell(3, 6, e) . cell(4, 6, e) . cell(5, 6, e) . cell(6, 6, e) . cell(7, 6, e) . cell(8, 6, e) . % 6  (Empty row)
cell(1, 5, e) . cell(2, 5, e) . cell(3, 5, e) . cell(4, 5, e) . cell(5, 5, e) . cell(6, 5, e) . cell(7, 5, e) . cell(8, 5, e) . % 5  (Empty row)
cell(1, 4, e) . cell(2, 4, e) . cell(3, 4, e) . cell(4, 4, e) . cell(5, 4, e) . cell(6, 4, e) . cell(7, 4, e) . cell(8, 4, e) . % 4  (Empty row)
cell(1, 3, e) . cell(2, 3, e) . cell(3, 3, e) . cell(4, 3, e) . cell(5, 3, e) . cell(6, 3, e) . cell(7, 3, e) . cell(8, 3, e) . % 3  (Empty row)
cell(1, 2, wp). cell(2, 2, wp). cell(3, 2, wp). cell(4, 2, wp). cell(5, 2, wp). cell(6, 2, wp). cell(7, 2, wp). cell(8, 2, wp). % 2
cell(1, 1, wr). cell(2, 1, wn). cell(3, 1, wb). cell(4, 1, wq). cell(5, 1, wk). cell(6, 1, wb). cell(7, 1, wn). cell(8, 1, wr). % 1
% White Pawn  . White Pawn    . White Pawn    . White Pawn    . White Pawn    . White Pawn    . White Pawn    . White Pawn    .
% White Rook  . White kNight  . White Bishop  . White Queen   . White King    . White Bishop  . White kNight  . White Rook    .
%     a       .       b       .       c       .       d       .       e       .       f       .       g       .       h       .

%turn(?COLOR)
turn(white).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                             Pieces and teams                               %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

pawn(wp).   pawn(bp).    % white and black Pawns
rook(wr).   rook(br).    % white and black Rooks
knight(wn). knight(bn).  % white and black kNights
bishop(wb). bishop(bb).  % white and black Bishops
queen(wq).  queen(bq).   % white and black Queens
king(wk).   king(bk).    % white and balck Kings

% team(?Piece, ?Color)
team(Piece, Color) :- member(Piece, [wp,wr,wn,wb,wq,wk]), Color = white.
team(Piece, Color) :- member(Piece, [bp,br,bn,bb,bq,bk]), Color = black.

% allies(?Piece1, ?Piece2)
allies(Piece1, Piece2) :- 
  team(Piece1, Color),
  team(Piece2, Color).

% enemies(?Piece1, ?Piece2)
enemies(Piece1, Piece2) :- 
  team(Piece1, Color1),
  team(Piece2, Color2),
  Color1 \= Color2.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                      Legal moves (for every piece)                         %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% empty_or_enemy(+Piece1, ?Piece2)
empty_or_enemy(Piece1, Piece2) :- enemies(Piece1, Piece2).
empty_or_enemy(_, e).

% no_pieces_interposed(+P0, +P)
no_pieces_interposed(P0, P) :- adjacent(P0, P).
no_pieces_interposed(P0, P) :- in_between(P0, P, Points), empty_cells(Points).


% legal_move(+P0, ?P))

%%% Pawn legal move
legal_move(P0, P) :-
  cell(P0, P0_content),
  pawn(P0_content),
  team(P0_content, Color),
  (
    ( % A pawn can move one step forward to an empty cell.
      steps_forward(P0, P, 1, Color), cell(P, e)
    );
    ( % A pawn can move two cells ahead if the pawn hasn't moved yet and those two cells are both empty.
      steps_forward(P0, P, 2, Color), cell(P, e),
      steps_forward(P0, P1, 1, Color), cell(P1, e),
      history(HISTORY),
      first_move(P0, HISTORY)
    );
    ( % A pawn can move one cell diagonally ahead if there's an enemy piece in the cell of arrival.
      (steps_forward_right(P0, P, 1, Color), cell(P, P_content) ; steps_forward_left(P0, P, 1, Color), cell(P, P_content)),
      enemies(P0_content, P_content)
    )
  ).

%%% Knight legal move
legal_move(P0, P) :-
  cell(P0, P0_content),
  knight(P0_content),
  l_pattern(P0, P),
  cell(P, P_content),
  ( % A knight can move with an "L" pattern to an empty cell or to a cell containing an enemy piece.
    P_content = e; enemies(P0_content, P_content)
  ).

%%% Bishop legal move
legal_move(P0, P) :-
  cell(P0, P0_content),
  bishop(P0_content),
  cell(P, P_content),
  aligned_diagonally(P0, P),
  empty_or_enemy(P0_content, P_content),
  no_pieces_interposed(P0, P).

%%% Rook legal move
legal_move(P0, P) :-
  cell(P0, P0_content),
  rook(P0_content),
  cell(P, P_content),
  aligned_axis(P0, P),
  empty_or_enemy(P0_content, P_content),
  no_pieces_interposed(P0, P).

%%% Queen legal move
legal_move(P0, P) :-
  cell(P0, P0_content),
  queen(P0_content),
  cell(P, P_content),
  aligned(P0, P),
  empty_or_enemy(P0_content, P_content),
  no_pieces_interposed(P0, P).

%%% King legal move
legal_move(P0, P) :-
  cell(P0, P0_content),
  king(P0_content),
  adjacent(P0, P),
  cell(P, P_content),
  empty_or_enemy(P0_content, P_content).


%%%%%%%% SPECIAL MOVES: CASTLING %%%%%%%%

% Short castling
% Long castling


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                          General chess rules                               %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% next_turn(?Previous, ?Next)
next_turn(white, black).
next_turn(black, white).

% change_turn
change_turn :-
  next_turn(Current, Next),
  retract(turn(Current)),
  assert(turn(Next)),
  !.  % red cut!


% under_enemy_attack(+P)
under_enemy_attack(P) :- 
  cell(Pi, _),
  legal_move(Pi, P),
  print(Pi),
  !.  % green cut

% under_check(+Color)
under_check(Color) :-
  king(Piece),
  team(Piece, Color),
  cell(P, Piece),
  under_enemy_attack(P),
  !.  % green cut


% can_move(+Color)
can_move(Color) :-
  team(Allied_piece, Color),
  cell(P0, Allied_piece),
  legal_move(P0, P),
  move(Allied_piece, P0, P),  % modifying the knowledge base! (and changing turn...)
  (
    (
      not(under_check(Color)),
      undo_last_move,  % modifying the knowledge base! (and changing turn...)
      true 
    );
    (
      under_check(Color),  % necessary ?
      undo_last_move,  % modifying the knowledge base! (and changing turn...)
      fail
    )
  )
  , !.  % green cut (not used in the can_move/3)

% can_move(+Color, -P0, -P)
can_move(Color, P0, P) :-
  team(Allied_piece, Color),
  cell(P0, Allied_piece),
  legal_move(P0, P),
  move(Allied_piece, P0, P),  % modifying the knowledge base! (and changing turn...)
  (
    (
      not(under_check(Color)),
      undo_last_move,  % modifying the knowledge base! (and changing turn...)
      true
    );
    (
      under_check(Color),
      undo_last_move,  % modifying the knowledge base! (and changing turn...)
      fail
    )
  ).


% under_checkmate(+Color)
under_checkmate(Color) :-
  under_check(Color),
  not (can_move(Color)).
  
% under_stall(+Color)
under_stall(Color) :-
  not (under_check(Color)),
  not (can_move(Color)).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%           Actual moving and updating the board representation              %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


%%%%%%% PUBLIC INTERFACE %%%%%%%%

% move(+Piece, +P0, +P)
move(Piece, P0, P) :-
  turn(Color),
  team(Piece, Color),
  cell(P0, Piece),
  legal_move(P0, P),
%  not(must_promote(Piece, P)),  % when reaching the last row, a pawn cannot move without promotion!
  cell(P, P_content),
  update_board(
    [cell(P0, Piece), cell(P, P_content)],  % things to retract
    [cell(P0, e), cell(P, Piece)]           % things to assert  
  ),
  change_turn.  %!.  % green cut if everything is ok... maybe useless.

%move_pawn_and_promote
%move_and_promote(Piece, Promoted_piece, P0, P) :-
%  turn(Color),
%  team(Piece, Color),
%  cell(P0, Piece),
%  legal_move(P0, P),
%  must_promote(Piece, P),
%  legal_promotion(Piece, To_piece),
%  cell(P, P_content),
%  update_board(
%    [cell(P0, Piece), cell(P, P_content)],  % things to retract
%    [cell(P0, e), cell(P, Promoted_piece)]  % things to assert  
%  ),
%  change_turn,
%  !.  % green cut if everything is ok...


%%%%%%% PRIVATE FUNCTINOALITIES %%%%%%%%

history([]).

update_board(Retracts_list, Asserts_list) :-
  retract_these(Retracts_list),
  assert_these(Asserts_list),
  retract(history(Old_history)),
  append([(Retracts_list, Asserts_list)], Old_history, Updated_history),
  assert(history(Updated_history)).

undo_last_move :-
  retract(history([(Last_retracted_list, Last_asserted_list) | Older_history])),
  retract_these(Last_asserted_list),
  assert_these(Last_retracted_list),
  assert(history(Older_history)),
  change_turn.


first_move(P, []).
first_move(P, [(Last_retracted_list, Last_asserted_list) | Older_history]) :- 
  not(member(cell(P, _), Last_retracted_list)),
  not(member(cell(P, _), Last_asserted_list)),
  first_move(P, Older_history).


retract_these([]).
retract_these([Head | Tail]) :- retract(Head), retract_these(Tail).

assert_these([]).
assert_these([Head | Tail]) :- assert(Head), assert_these(Tail).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                      Relevant chess facts and rules                        %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% must_promote(+Piece, +P)
must_promote(Piece, P) :-  % Pawns must promote when reaching the last row.
  pawn(Piece),
  last_row(P).

% legal_promotion(+Piece, +To_piece)
legal_promotion(Piece, To_piece) :-  % Promotion can be to a queen, a knight, a rook or a bishop of the same team.
  ally(To_piece),
  (rook(To_piece); knight(To_piece); bishop(To_piece); queen(To_piece)).

% last_row(?Row)
last_row(Row) :- player(white), Row = 8.  %% The 8th row is the last one for the white player.
last_row(Row) :- player(black), Row = 1.  %% The 1st row is the last one for the black player.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                Handy spatial predicates for a chess board                  %%
%%         (white pieces face north, while black piece face south)            %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%% NB: Remember that, by design, "Steps" > 0.
%%     At least one between "P" and "Steps" must be istantiated.

%steps_forward(
steps_forward(P0, P, Steps, Color) :- Color = white, steps_north(P0, P, Steps).
steps_forward(P0, P, Steps, Color) :- Color = black, steps_south(P0, P, Steps).

%steps_backward
steps_backward(P0, P, Steps, Color) :- Color = white, steps_south(P0, P, Steps).
steps_backward(P0, P, Steps, Color) :- Color = black, steps_north(P0, P, Steps).

%steps_right(
steps_right(P0, P, Steps, Color) :- Color = white, steps_east(P0, P, Steps).
steps_right(P0, P, Steps, Color) :- Color = black, steps_west(P0, P, Steps).

%steps_left(
steps_left(P0, P, Steps, Color) :- Color = white, steps_west(P0, P, Steps).
steps_left(P0, P, Steps, Color) :- Color = black, steps_east(P0, P, Steps).


%steps_forward_right(
steps_forward_right(P0, P, Steps, Color) :- Color = white, steps_north_east(P0, P, Steps).
steps_forward_right(P0, P, Steps, Color) :- Color = black, steps_south_west(P0, P, Steps).

%steps_forward_left(
steps_forward_left(P0, P, Steps, Color) :- Color = white, steps_north_west(P0, P, Steps).
steps_forward_left(P0, P, Steps, Color) :- Color = black, steps_south_east(P0, P, Steps).

%steps_backward_right(
steps_backward_right(P0, P, Steps, Color) :- Color = white, steps_south_east(P0, P, Steps).
steps_backward_right(P0, P, Steps, Color) :- Color = black, steps_north_west(P0, P, Steps).

%steps_backward_left(
steps_backward_left(P0, P, Steps, Color) :- Color = white, steps_south_west(P0, P, Steps).
steps_backward_left(P0, P, Steps, Color) :- Color = black, steps_north_east(P0, P, Steps).


%empty_cells(+[Points]).
empty_cells([]).
empty_cells([Point | Points]) :- 
  cell(Point, e),
  empty_cells(Points).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                              SPACE 2D library                              %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%         Point representation in 2d space with integer coordinates          %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%point(?X, ?Y)
point(X, Y) :-
  (integer(X); var(X)),
  (integer(Y); var(Y)).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%    Projection of the vector point(X0,Y0) -> point(X,Y) on N,S,W,E axes     %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%projection_north(+point(X0,Y0), +point(X,Y), -Projection)
projection_north(point(_,Y0), point(_,Y), Projection) :- nonvar(Y0), nonvar(Y), Projection is Y - Y0, !.  % green cut
%projection_north(+point(X0,Y0), -point(X,Y), +Projection)
projection_north(point(_,Y0), point(_,Y), Projection) :- nonvar(Y0), nonvar(Projection), Y is Y0 + Projection.

%projection_south(+point(X0,Y0), +point(X,Y), -Projection)
projection_south(point(_,Y0), point(_,Y), Projection) :- nonvar(Y0), nonvar(Y), Projection is Y0 - Y, !.  % green cut
%projection_south(+point(X0,Y0), -point(X,Y), +Projection)
projection_south(point(_,Y0), point(_,Y), Projection) :- nonvar(Y0), nonvar(Projection), Y is Y0 - Projection.

%projection_east(+point(X0,Y0), +point(X,Y), -Projection)
projection_east(point(X0,_), point(X,_), Projection) :- nonvar(X0), nonvar(X), Projection is X - X0, !.  % green cut
%projection_east(+point(X0,Y0), -point(X,Y), +Projection)
projection_east(point(X0,_), point(X,_), Projection) :- nonvar(X0), nonvar(Projection), X is X0 + Projection.

%projection_west(+point(X0,Y0), +point(X,Y), -Projection)
projection_west(point(X0,_), point(X,_), Projection) :- nonvar(X0), nonvar(X), Projection is X0 - X, !.  % green cut
%projection_west(+point(X0,Y0), -point(X,Y), +Projection)
projection_west(point(X0,_), point(X,_), Projection) :- nonvar(X0), nonvar(Projection), X is X0 - Projection.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%       Moving some steps towards one particular direction (N,S,W,E)         %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%% By design, "Steps" > 0.

%steps_north(+P0, ?P, ?Steps)  
steps_north(P0, P, Steps) :- 
  projection_north(P0, P, Steps),
  projection_east(P0, P, 0),
  Steps > 0.

%steps_south(+P0, ?P, ?Steps)
steps_south(P0, P, Steps) :- 
  projection_south(P0, P, Steps),
  projection_east(P0, P, 0),
  Steps > 0.

%steps_east(+P0, ?P, ?Steps)
steps_east(P0, P, Steps) :- 
  projection_east(P0, P, Steps),
  projection_north(P0, P, 0),
  Steps > 0.

%steps_west(+P0, ?P, ?Steps)
steps_west(P0, P, Steps) :- 
  projection_west(P0, P, Steps),
  projection_north(P0, P, 0),
  Steps > 0.

%steps_north_east(+P0, ?P, ?Steps)
steps_north_east(P0, P, Steps) :-
  projection_north(P0, P, Steps),
  projection_east(P0, P, Steps),
  Steps > 0.

%steps_north_west(+P0, ?P, ?Steps)
steps_north_west(P0, P, Steps) :-
  projection_north(P0, P, Steps),
  projection_west(P0, P, Steps),
  Steps > 0.

%steps_south_east(+P0, ?P, ?Steps)
steps_south_east(P0, P, Steps) :-
  projection_south(P0, P, Steps),
  projection_east(P0, P, Steps),
  Steps > 0.

%steps_south_west(+P0, ?P, ?Steps)
steps_south_west(P0, P, Steps) :-
  projection_south(P0, P, Steps),
  projection_west(P0, P, Steps),
  Steps > 0.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                  Relevant alignements between two points                   %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%aligned_north(+P0, +P)
aligned_north(P0, P) :- steps_north(P0, P, _).

%aligned_south(+P0, +P)
aligned_south(P0, P) :- steps_south(P0, P, _).

%aligned_east(+P0, +P)
aligned_east(P0, P) :- steps_east(P0, P, _).

%aligned_west(+P0, +P)
aligned_west(P0, P) :- steps_west(P0, P, _).


%aligned_north_east(+P0, +P)
aligned_north_east(P0, P) :- steps_north_east(P0, P, _).

%aligned_north_west(+P0, +P)
aligned_north_west(P0, P) :- steps_north_west(P0, P, _).

%aligned_east(point(+P0, +P)
aligned_south_east(P0, P) :- steps_south_east(P0, P, _).

%aligned_west(point(+P0, +P)
aligned_south_west(P0, P) :- steps_south_west(P0, P, _).


%aligned_vertically(+P0, +P)
aligned_vertically(P0, P) :- aligned_north(P0, P), !.  % green cut
aligned_vertically(P0, P) :- aligned_south(P0, P).

%aligned_horizontally(+P0, +P)
aligned_horizontally(P0, P) :- aligned_east(P0, P), !.  % green cut
aligned_horizontally(P0, P) :- aligned_west(P0, P).


%aligned_main_diagonal(+P0, +P)
aligned_main_diagonal(P0, P) :- aligned_north_west(P0, P), !.  % green cut
aligned_main_diagonal(P0, P) :- aligned_south_east(P0, P).

%aligned_anti_diagonal(+P0, +P)
aligned_anti_diagonal(P0, P) :- aligned_north_east(P0, P), !.  % green cut
aligned_anti_diagonal(P0, P) :- aligned_south_west(P0, P).


%aligned_axis(+P0, +P)
aligned_axis(P0, P) :- aligned_vertically(P0, P), !.  % green cut
aligned_axis(P0, P) :- aligned_horizontally(P0, P).

%aligned_diagonally(+P0, +P)
aligned_diagonal(P0, P) :- aligned_main_diagonal(P0, P), !.  % green cut
aligned_diagonal(P0, P) :- aligned_anti_diagonal(P0, P).


%aligned(+P0, +P)
aligned(P0, P) :- aligned_axis(P0, P), !.  % green cut
aligned(P0, P) :- aligned_diagonal(P0, P).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%               Lists of points between two (aligned) points                 %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    
%in_between_north(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_north(point(X0,Y0), point(X0,Y), [point(X0,Yi)]) :- Yi is Y0 + 1, Yi is Y - 1, !.  % green cut
in_between_north(point(X0,Y0), point(X0,Y), [point(X0,Yi) | Other_points]) :- 
  Yi is Y0 + 1, Yi < Y,
  in_between_north(point(X0,Yi), point(X0,Y), Other_points).

%in_between_south(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_south(point(X0,Y0), point(X0,Y), [point(X0,Yi)]) :- Yi is Y0 - 1, Yi is Y + 1, !.  % green cut
in_between_south(point(X0,Y0), point(X0,Y), [point(X0,Yi) | Other_points]) :- 
  Yi is Y0 - 1, Yi > Y,
  in_between_south(point(X0,Yi), point(X0,Y), Other_points).

%in_between_east(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_east(point(X0,Y0), point(X,Y0), [point(Xi,Y0)]) :- Xi is X0 + 1, Xi is X - 1, !.  % green cut
in_between_east(point(X0,Y0), point(X,Y0), [point(Xi,Y0) | Other_points]) :- 
  Xi is X0 + 1, Xi < X,
  in_between_east(point(Xi,Y0), point(X,Y0), Other_points).

%in_between_west(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_west(point(X0,Y0), point(X,Y0), [point(Xi,Y0)]) :- Xi is X0 - 1, Xi is X + 1, !.  % green cut
in_between_west(point(X0,Y0), point(X,Y0), [point(Xi,Y0) | Other_points]) :- 
  Xi is X0 - 1, Xi > X,
  in_between_west(point(Xi,Y0), point(X,Y0), Other_points).


%in_between_north_east(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_north_east(point(X0,Y0), point(X,Y), [point(Xi,Yi)]) :- 
  Xi is X0 + 1, Xi is X - 1,
  Yi is Y0 + 1, Yi is Y - 1, !.  % green cut
in_between_north_east(point(X0,Y0), point(X,Y), [point(Xi,Yi) | Other_points]) :- 
  Xi is X0 + 1, Xi < X,
  Yi is Y0 + 1, Yi < Y,
  in_between_north_east(point(Xi,Yi), point(X,Y), Other_points).

%in_between_north_west(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_north_west(point(X0,Y0), point(X,Y), [point(Xi,Yi)]) :- 
  Xi is X0 - 1, Xi is X + 1,
  Yi is Y0 + 1, Yi is Y - 1, !.  % green cut
in_between_north_west(point(X0,Y0), point(X,Y), [point(Xi,Yi) | Other_points]) :- 
  Xi is X0 - 1, Xi > X,
  Yi is Y0 + 1, Yi < Y,
  in_between_north_west(point(Xi,Yi), point(X,Y), Other_points).

%in_between_south_east(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_south_east(point(X0,Y0), point(X,Y), [point(Xi,Yi)]) :- 
  Xi is X0 + 1, Xi is X - 1,
  Yi is Y0 - 1, Yi is Y + 1, !.  % green cut
in_between_south_east(point(X0,Y0), point(X,Y), [point(Xi,Yi) | Other_points]) :- 
  Xi is X0 + 1, Xi < X,
  Yi is Y0 - 1, Yi > Y,
  in_between_south_east(point(Xi,Yi), point(X,Y), Other_points).

%in_between_south_west(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_south_west(point(X0,Y0), point(X,Y), [point(Xi,Yi)]) :- 
  Xi is X0 - 1, Xi is X + 1,
  Yi is Y0 - 1, Yi is Y + 1, !.  % green cut
in_between_south_west(point(X0,Y0), point(X,Y), [point(Xi,Yi) | Other_points]) :- 
  Xi is X0 - 1, Xi > X,
  Yi is Y0 - 1, Yi > Y,
  in_between_south_west(point(Xi,Yi), point(X,Y), Other_points).


%in_between(+P0, +P, -Points)
in_between(P0, P, Points) :- in_between_north(P0, P, Points), !.       % green cut
in_between(P0, P, Points) :- in_between_south(P0, P, Points), !.       % green cut
in_between(P0, P, Points) :- in_between_east(P0, P, Points), !.        % green cut
in_between(P0, P, Points) :- in_between_west(P0, P, Points), !.        % green cut
in_between(P0, P, Points) :- in_between_north_east(P0, P, Points), !.  % green cut
in_between(P0, P, Points) :- in_between_north_west(P0, P, Points), !.  % green cut
in_between(P0, P, Points) :- in_between_south_east(P0, P, Points), !.  % green cut
in_between(P0, P, Points) :- in_between_south_west(P0, P, Points).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                             Miscellaneous                                  %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%adjacent(+point(X0,Y0), ?point(X,Y))
adjacent(point(X0,Y0), point(X,Y)) :-
  (X is X0 - 1; X is X0; X is X0 + 1),
  (Y is Y0 - 1; Y is Y0; Y is Y0 + 1),
  not (X = X0, Y = Y0).  % comment out this subgoal to include the soultion where point(X,Y) is the same as point(X0,Y0)

%l_pattern(+point(X0,Y0), ?point(X,Y))
l_pattern(point(X0,Y0), point(X,Y)) :-
  (X is X0 + 2; X is X0 - 2),
  (Y is Y0 + 1; Y is Y0 - 1).
l_pattern(point(X0,Y0), point(X,Y)) :-
  (X is X0 + 1; X is X0 - 1),
  (Y is Y0 + 2; Y is Y0 - 2).
