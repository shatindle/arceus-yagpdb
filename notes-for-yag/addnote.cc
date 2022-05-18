{{/* Created by Krabs
	Part of the note system.
 
	Syntax is -addnote <user> <note>
	This command will add a note to the user. This can be used to track certain user actions within the server.
*/}}
 
{{$args := parseArgs 2 "Syntax is `-addnote <userID> <note>`" (carg "userid" "userID") (carg "string" "note")}}
 
{{$timestamp := (joinStr "" "<t:" currentTime.Unix ":F>")}}
{{$moderator := (joinStr "" "Moderator: " .User.Mention " (" .User.ID ")")}}
{{$modCategory := 975437545812942929}}
 
{{if ne .Channel.ParentID $modCategory}}
	{{deleteTrigger 0}}
{{end}}
 
{{if not (userArg ($args.Get 0))}}
	{{if eq .Channel.ParentID $modCategory}}
		{{sendMessage nil (joinStr "" .User.Mention ", please use a valid user ID or user mention.")}}
	{{else}}
		{{sendDM (joinStr "" .User.Mention ", please use a valid user ID or user mention.\n```" .Message.Content "```")}}
	{{end}}
{{else}}
	{{$user := (userArg ($args.Get 0))}}
	{{$input := ($args.Get 1)}}
 
	{{$note := (joinStr "" $moderator "\n" $timestamp "\n\n" $input)}}
 
	{{$existingNotes := ""}}
	
	{{if (dbGet $user.ID "notes")}}
		{{$existingNotes = (dbGet $user.ID "notes").Value}}
	{{else}}
		{{$existingNotes = cslice}}
	{{end}}
 
	{{dbSet $user.ID "notes" ($existingNotes.Append $note)}}
	
	{{if eq .Channel.ParentID $modCategory}}
		{{sendMessage nil (joinStr "" .User.Mention ", your note for " $user.Mention " has been saved.")}}
	{{else}}
		{{sendDM (joinStr "" .User.Mention ", your note for " $user.Mention " has been saved.")}}
	{{end}}
 
{{end}}