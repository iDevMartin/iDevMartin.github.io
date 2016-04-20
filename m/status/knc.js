//
// Kary Notation Compiler (KNC.js)
// A super nano size compiler to generate Kary Notation for web
// Copyright 2015 Pouya Kary <k@arendelle.org>
// Published under GNU General Public License v3
//


/* ────────────────────────────────────────────────────────────────────────────────────────── *
 * ::::::::::::::::::::::: K A R Y	 N O T A T I O N	 C O M P I L E R :::::::::::::::::::::: *
 * ────────────────────────────────────────────────────────────────────────────────────────── */

//
// ─── CONTROLLERS ──────────────────────────────────────────────────────────────────────────
//
	var KNCode = "";
	var KNi = 0;
	var KNVersion = 0.1;
	var KNColor = "969696";
	var KNReadSpace = false;
	var KNError = "";

//
// ─── INIT ON START ────────────────────────────────────────────────────────────────────────
//
	function KNInitOnStart () {
		var elements = document.getElementsByClassName( 'kn' );
		for ( var i = 0 ; i < elements.length ; i++ ) {
			elements[ i ].innerHTML = KNGenerate( elements[ i ].innerHTML );
		}
	}

//
// ─── GENERATOR ────────────────────────────────────────────────────────────────────────────
//
	function KNGenerate ( code ) {
		KNError = "";
		KNReadSpace = false;
		KNCode = code;
		KNi = 0;
		var result = KNGenerateTag ( "KNEnvironment" , KNCompileWithLevel ( null ) );
		
		if ( KNError == "" ) {
			return result;
		} else {
			return "<span style=\"color:red;\">" + KNError + "</span>";
		}
	}
	
// ──────────────────────────────────────────────────────────────────────────────────────────

	function KNCompileWithLevel ( end ) {
		
		var result = "";
		var controller = true;
		
		// OUR SYSTEMS GOES BY SCANNING ALL THE LETTERS IN THE CODE
		// AND WE DECIDE WHAT TO DO NEXT AFTER WE FOUND OUT BY THE 
		// CURRENT LETTER. AS WE GO WITH CALLING THE FUNCTINGS INSIDE
		// THEIR OWN BODY WE DO THIS BY USING TWO MAIN VARIABLES KNCODE
		// TO KEEP THE ENTIRE CODE AND KNI TO KNOW WHCIH INDEX WE'RE
		// READING.
		while ( KNi < KNCode.length && controller ) {
			var letter = KNCode[ KNi ];
			
			switch ( letter ) {
				
				// @ IS THE ESCAPE SEQUENCE AND COMMAND IN THE CURRENT
				// SYSTEM. IT SUPPORTS SOME SIMPLE GRAMMARS AS WELL AS
				// SOME 
				case '@':
					KNi++;
					letter = KNCode[ KNi ];
					
					switch ( letter ) {
						
						// @[ ... ] BOLDS THE CONTENT
						case '[':
							KNi++;
							result += KNMakeTageWithName ( "b" , KNCompileWithLevel ( ']' ) );
							break;
							
							
						// @{ ... } ITALICS THE CONTENT
						case '{':
							KNi++;
							result += KNMakeTageWithName ( "i" , KNMakeTageWithName ( '}' ) );
							break;
							
					
						// @" ... " IS USED TO DISABLE THE WHITE SPACE IGNORANCE
						case '"':
							KNi++;
							KNReadSpace = true;
							result += KNCompileWithLevel ( '"' );
							KNReadSpace = false;
							break;
							

						// @> RETURNS A RIGH ARROW
						case '>':
							result += '→';
							break;
					
						
						// @< RETURNS A LEFT ARROW
						case '<':
							result += '←';
							break;
					

						// @ WITH NOTHING AFTER IT PLACES A SINGLE WHITE SPACE
						// SPACE LETTER IN WHITE SPACE INGNORANCE MODE.
						default:
							KNReport ( "Unknown formating comamnd '@" + letter + "'" );
							break;
					}
					break;
				
				// THIS IS A SPACE
				case end:
					KNi--;
					controller = false;
					break;
				
				case ']':
				case '}':
				case '"':
					if ( end != null ) {
						KNReport ( "Expected '" + end + "' instead of '" + letter + "'." );
					} else {
						KNReport ( "Not expecting grammar closer '" + letter + "' in top level." );
					}
					break;
					
				case ')':
				case '(':
					if ( KNReadSpace ) {
						result += letter;
					} else {
						KNReport ( "Kary Notaion has no support for Parentheses" );
					}
					break;
				
				case '[':
					KNi++;
					result += KNGenerateTag ( "KNBrackets" , KNCompileWithLevel ( ']' ) );
					break;
					
					
				// &times; is the HTML for ×
				case '*':
					result += " &times; ";
					break;
					
				
				// &divide; is the HTML for ÷
				case '/':
					result += " &divide; ";
					break;
			
			
				// Simply because of the HTML's tag style we can't
				// use greater than and less than letters in our
				// generated HTML codes. Instead we replace them by
				// some special escape sequences so we can be sure
				// we're not generating buggy codes.
				case '>':
					result += " &gt; ";
					break;
							
				case '<':
					result += " &lt; ";
					break;
					
				case '^':
				case '=':
				case '+':
				case '%':
				case '-':	
					result += ' ' + letter + ' ';
					break;
										
				// we generate this one in the 
				case ',':
					result += KNLetterTag ( ' ' + letter + ' ' );
					break;
					
				case ' ':
					if ( KNReadSpace ) {
						result += letter;
					}
					break;
				
				default:
					result += letter;
					break;
			}
			
			KNi++;
		}
		return result;
	}

// ──────────────────────────────────────────────────────────────────────────────────────────

	function KNGenerateTag ( css_style , html_code ) {
		return "<div class=\"" + css_style + "\">" + html_code + "</div>";
	}
	
// ──────────────────────────────────────────────────────────────────────────────────────────
		
	function KNLetterTag ( letter ) {
		return "<span style=\"color:#" + KNColor + "\">" + letter +"</span>";
	}
	
// ──────────────────────────────────────────────────────────────────────────────────────────

	function KNMakeTageWithName ( tag_name , tag_code ) {
		return "<" + tag_name + ">" + tag_code + "</" + tag_name + ">";
	}

// ──────────────────────────────────────────────────────────────────────────────────────────

	function KNReport ( msg ) {
		if ( KNError != "" ) {
			KNError += "<br />" + msg;
		} else {
			KNError += msg;
		}
		
		console.error ( msg );
	}

// ──────────────────────────────────────────────────────────────────────────────────────────

