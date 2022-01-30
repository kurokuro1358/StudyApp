import java.util.*;

class test{
    public static void main(String[] args){
        Scanner scan = new Scanner(System.in);
        String[][] str = new String[1900][3];
        
        for(int i=0; i<1900; i++){
            str[i][0] = "" + i+1;
            str[i][1] = scan.nextLine();
            str[i][2] = scan.nextLine();
        }

        for(int i=0; i<1900; i++){
            System.out.println("{ id: " + (i+1) + ", word: \"" + str[i][1].trim() + "\", meaning: \"" + str[i][2].trim() + "\"},");
            // System.out.println((i+1) + ", " + str[i][1] + ", " + str[i][2]);
        }
    }
}