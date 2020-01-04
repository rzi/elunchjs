<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="normalize.css" rel="stylesheet" type="text/css" /> 
    <link href="style.css" rel="stylesheet" type="text/css" />
    <title>Zarządzanie użytkownikami</title>
    <style>
        table {
        width: 100%;
        border-collapse: collapse;
        }

        table, td, th {
            border: 1px solid green;
        }
    </style>
</head>
<body>
    <?php
        session_start();
        $sesa = $_SESSION['sesa'];
        $kategoria=$_SESSION['type_select'];
        require "connection.php";
        connection();
    ?>

    <div class="eyebrow">
        <img src="./fonts/C25-SE-Earth Europe Africa-black.png" alt="" height ="25px">
        <span> Polska</span>
        <img src="./fonts/user.png" alt="" height ="25px">
        <?php
            echo'<p class="p_name">';
            echo " Witaj ";
            echo $_SESSION['name'];
            echo ' ';
            echo $_SESSION['surname'];
            echo '  ';
            echo  '</p>';
        ?>
    </div>   

    <header class="header_admin ">
        <img src="./fonts/schneider_LIO_White_RGB.png" alt="logo" height="84px">
        <div class="navbar">
            <span class="title_admin"> Panel administracyjny</span>
 
            <!-- navbar -->
            <ul class="topnav">
                <li><a href="spl_management.php"> zarządzanie SPLami </a></li>
                <li><a href="ftp_manager.php"> pobieranie przez FTP </a></li>
                <li><a href="ftp_manager_upload.php"> wysyłanie na serwer FTP</a></li>
                <li><a href="ftp_manager_delete.php"> skasowanie z serwera FTP</a></li>
                <li><a href="new_user.php"> nowy użytkownik </a></li>
            </ul>

        </div>
        <a class="a_help"  href="./pomoc.html">Pomoc</a>
    </header>

    <div id="hrline"></div>
    <br>
    <div class="panel_admin">
        <P> Wyświetl wszystkich użytkowników:</P>
        <br>
        <?php
            echo '<div style="width:auto; height:320px; overflow:auto;">';
            echo "<table>
            <thead>
                <tr >
                    <th>id </th>
                    <th>Sesa</th>
                    <th>Imię</th>
                    <th>Nazwisko</th>
                    <th>Hasło</th>
                    <th>Skasuj</th>
                    <th>Edytuj</th>

                </tr>
            </thead>";
            echo "<tbody>";
                if($result = mysqli_query($link,"select DISTINCT * from spl_users WHERE 1 ORDER BY id DESC")){
                    while($row = mysqli_fetch_assoc($result)) {
                        $val1 = $row['id'];
                        $val5 = $row['sesa'];
                        $val2 = $row['name'];
                        $val3 = $row['surname'];
                        $val4 = $row['password'];

                        echo "<tr><td>";
                        echo $val1;
                        echo "</td>";
                        echo "<td>";
                        echo $val5;
                        echo "</td>";
                        echo "<td>";
                        echo "$val2";
                        echo "</td>";
                        echo "<td>";
                        echo "$val3";
                        echo "</td>";
                        echo "<td style='width:80px;'>";
                        // echo "$val4";
                        echo "<input type='password' style='border:none;' readonly value=$val4 size='16' maxlength='50'>";
                        echo "</td>";
                        echo "<td>
                        <a href=\"delete_user.php?a=del&amp;id={$row['id']}\">DEL</a>
                        </td>";
                        echo "<td>
                        <a href=\"edit_user.php?a=edit&amp;id={$row['id']}\">EDIT</a>
                        </td>";
                        echo "</tr>" ;
                    }
                }
                mysqli_free_result($result);
                mysqli_close($link);
            echo "</tbody>
                </table>";
                echo '</div>';
                echo '<br>';
        ?>
       
        <br>
        <br>                
        <a href="index.html"><<< powrót do strony głównej</a>
        <br>

    </div>
    <footer>
        <span>Schneider Electric Industries Polska</span>
    </footer>
</body>
</html>